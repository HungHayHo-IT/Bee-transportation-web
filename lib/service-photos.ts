import type { StaticImageData } from 'next/image';

import type { ServiceKey } from './services';
import serviceConsulting from '@/public/img/service-consulting.jpg';
import serviceCrossborder from '@/public/img/service-crossborder.jpg';
import serviceCustoms from '@/public/img/service-customs.jpg';
import serviceDomestic from '@/public/img/service-domestic.jpg';
import serviceLeasing from '@/public/img/service-leasing.jpg';
import serviceLifting from '@/public/img/service-lifting.jpg';
import serviceMultimodal from '@/public/img/service-multimodal.jpg';
import servicePacking from '@/public/img/service-packing.jpg';
import serviceProject from '@/public/img/service-project.jpg';

/**
 * The one photograph that stands for each service line.
 *
 * Two places show it, so it lives here rather than beside either of them: the
 * card row on the home page — see components/sections/index.tsx — and the
 * problems slide on the service's own page, see ServiceProblems in
 * components/sections/service.tsx. One file per service, shown in both.
 *
 * Keyed in SERVICE_KEYS order. Partial on purpose: both consumers fall back to
 * a flat plate for a key that is missing here, so the set can be replaced one
 * file at a time without either layout breaking.
 */
export const SERVICE_PHOTOS: Partial<Record<ServiceKey, StaticImageData>> = {
  consulting: serviceConsulting,
  domestic: serviceDomestic,
  multimodal: serviceMultimodal,
  project: serviceProject,
  lifting: serviceLifting,
  packing: servicePacking,
  crossborder: serviceCrossborder,
  leasing: serviceLeasing,
  customs: serviceCustoms,
};
