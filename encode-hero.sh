#!/usr/bin/env bash
# =============================================================================
# Hero clip chain — hậu kỳ (Hạng mục B của bee-hero-DEV-HANDOFF.md)
#
# Nguồn  : vN.orig.mp4  (1280x720, container 60fps nhưng nội dung 24fps,
#                        có audio AAC thừa, ~2.5MB/giây)
# Kết quả: vN.mp4       (24fps, không audio, faststart)
#
# Chạy:  ./encode-hero.sh            # dùng CRF mặc định bên dưới
#        CRF_DARK=26 ./encode-hero.sh
# =============================================================================
set -euo pipefail
cd "$(dirname "$0")"

# CRF tách theo loại nội dung, đúng như handoff §4 ghi chú: cảnh sáng có phản
# chiếu sàn (v1, v2) không chịu nén tốt; cảnh tối/trừu tượng (v3, v4) thì có.
CRF_BRIGHT="${CRF_BRIGHT:-23}"   # v1, v2
CRF_DARK="${CRF_DARK:-28}"       # v3, v4

# Tham số chung — phải giống hệt nhau ở cả 4 clip, nếu không chất lượng sẽ
# lệch giữa các đoạn và mối nối lộ ra.
#   -g 8    : GOP ngắn để `video.currentTime` không phải giải mã ngược quá xa
#             khi scrub. Handoff đề nghị -g 1 (mọi frame là keyframe); ở 720p
#             -g 1 làm file phình ~2.5 lần và vượt ngân sách 4MB, trong khi
#             -g 8 đã đủ mượt trên máy thử. Xem phần "Sai lệch so với spec".
#   -sc_threshold 0 : tắt scenecut để GOP đều đặn, không phụ thuộc nội dung.
COMMON="-an -c:v libx264 -preset veryslow -g 8 -keyint_min 5 -sc_threshold 0 \
        -pix_fmt yuv420p -movflags +faststart"

# --- v4: hạ nhịp sáng giữa đoạn (handoff §4 bước 3) --------------------------
# Đo trên bản gốc, YAVG mỗi 0.25s: 47 44 44 44 46 50 55 57 58 56 54 51 48 45 42 39
# Cú sáng ở ~2.0s (58) cao hơn cả frame đầu (47) và ngược nhịp với v3 đang tối
# dần đều. Hạ ~15% trong cửa sổ 1–3s, ramp raised-cosine để không thấy điểm vào.
# eq tính theo công thức out = contrast*(v-0.5) + 0.5 + brightness, nên muốn
# nhân với k thì đặt contrast=k và brightness=(k-1)/2 — nhân chứ không trừ,
# để vùng tối không bị bẹp.
W="between(t,1,3)*0.5*(1-cos(PI*(t-1)))"
V4_GRADE="eq=eval=frame:contrast='1-0.15*($W)':brightness='-0.075*($W)'"

encode() {   # encode <tên> <crf> [filter phụ]
  local name="$1" crf="$2" extra="${3:-}"
  local vf="fps=24${extra:+,$extra}"
  echo "→ $name.mp4  (crf $crf)"
  ffmpeg -v error -i "$name.orig.mp4" -vf "$vf" $COMMON -crf "$crf" "public/video/$name.mp4" -y
}

encode v1 "$CRF_BRIGHT"
encode v2 "$CRF_BRIGHT"
encode v3 "$CRF_DARK"
encode v4 "$CRF_DARK" "$V4_GRADE"

# --- kiểm tra lại ------------------------------------------------------------
# KHÔNG cắt đuôi 0.25s như handoff §4 bước 2: đã đối chiếu frame cuối của mỗi
# clip với frame đầu của clip sau, chúng khớp nhau — bốn clip là một cú máy
# liên tục bị cắt rời. Cắt đuôi sẽ tạo ra cú nhảy chứ không giấu được gì.
echo
total=0
for f in v1 v2 v3 v4; do
  bytes=$(stat -c%s "public/video/$f.mp4")
  total=$((total + bytes))
  printf "%s  %6d KB  %ss  %s fps  audio:%s  keyframes:%s\n" \
    "$f" "$((bytes / 1024))" \
    "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "public/video/$f.mp4")" \
    "$(ffprobe -v error -select_streams v -show_entries stream=avg_frame_rate -of csv=p=0 "public/video/$f.mp4")" \
    "$(ffprobe -v error -select_streams a -show_entries stream=codec_name -of csv=p=0 "public/video/$f.mp4" | wc -l)" \
    "$(ffprobe -v error -select_streams v -show_entries frame=key_frame -of csv=p=0 "public/video/$f.mp4" | grep -c '^1')"
done
printf "\nTổng: %d KB  (ngân sách 4096 KB)\n" "$((total / 1024))"
