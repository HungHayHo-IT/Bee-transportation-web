import { backendUrl, isConfigured } from '@/lib/backend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Bản PDF đã chốt, chảy thẳng qua chứ không đọc vào bộ nhớ rồi gói lại: phiếu
 * có thể vài trăm kB và không có lý do gì để landing giữ nó.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  if (!isConfigured()) return new Response('Chưa cấu hình máy chủ', { status: 503 });
  const { token } = await params;
  const r = await fetch(backendUrl(`/sign/${encodeURIComponent(token)}/pdf`), {
    cache: 'no-store',
  });
  if (!r.ok) return new Response('Không lấy được phiếu', { status: r.status });
  return new Response(r.body, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': r.headers.get('content-disposition') ?? 'inline',
      'Cache-Control': 'no-store',
    },
  });
}
