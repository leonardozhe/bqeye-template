/**
 * 镜片配置 5 步向导 — 数据类型
 * 参考 BQEye 实际配镜流程
 */

// ─── Step 1: 镜片类型 ───
export type LensType = 'single-vision' | 'reading' | 'non-prescription' | 'progressive' | 'sunglasses-rx' | 'sunglasses-non-rx';

export const LENS_TYPE_OPTIONS: { id: LensType; label: string; labelZh: string; desc: string }[] = [
  { id: 'single-vision', label: 'Single Vision', labelZh: '单光镜片', desc: '用于近视或远视矫正' },
  { id: 'reading', label: 'Reading Glasses', labelZh: '老花镜', desc: '用于阅读矫正' },
  { id: 'non-prescription', label: 'Non-Prescription', labelZh: '平光镜片', desc: '无度数，仅装饰或防护' },
  { id: 'progressive', label: 'Progressive', labelZh: '渐进多焦点', desc: '多焦距无缝过渡' },
  { id: 'sunglasses-rx', label: 'Sunglasses Prescription', labelZh: '太阳镜处方', desc: '带度数的太阳镜片' },
  { id: 'sunglasses-non-rx', label: 'Sunglasses Non-Prescription', labelZh: '太阳镜平光', desc: '无度数太阳镜片' },
];

export function needsPrescription(lensType: LensType): boolean {
  return ['single-vision', 'reading', 'progressive', 'sunglasses-rx'].includes(lensType);
}

// ─── Step 2: 验光数据 ───
export interface PrescriptionEye {
  sph: number;   // 球镜 -10.00 ~ +10.00, 步长 0.25
  cyl: number;   // 柱镜 -6.00 ~ +6.00, 步长 0.25 (可选, 散光)
  axis: number;  // 轴位 0~180 (当 cyl 非 0 时必填)
}

export interface PrescriptionData {
  right: PrescriptionEye;
  left: PrescriptionEye;
}

// ─── Step 3: 瞳距 (PD) ───
export interface PDData {
  mode: 'single' | 'dual'; // 单瞳距 | 双瞳距
  value: number;           // 单瞳距值 (50~80mm)
  left?: number;           // 左眼瞳距
  right?: number;          // 右眼瞳距
}

// ─── Step 4: 折射率 ───
export interface LensIndex {
  value: '1.56' | '1.60' | '1.67' | '1.74';
  label: string;
  priceExtra: number;
  desc: string;
  suitableFor: string; // "适合 0~-3.00D" 等
}

export const LENS_INDEXES: LensIndex[] = [
  { value: '1.56', label: '1.56 标准', priceExtra: 0, desc: '经济实惠，轻薄适中', suitableFor: '0 ~ -3.00D' },
  { value: '1.60', label: '1.60 薄', priceExtra: 15, desc: '较薄，韧性好', suitableFor: '-3.00 ~ -6.00D' },
  { value: '1.67', label: '1.67 超薄', priceExtra: 35, desc: '超薄，高度数推荐', suitableFor: '-6.00 ~ -10.00D' },
  { value: '1.74', label: '1.74 极薄', priceExtra: 60, desc: '极致超薄，顶级材质', suitableFor: '-10.00D 以上' },
];

// ─── Step 5: 镀膜/附加功能 ───
export interface LensCoating {
  id: string;
  name: string;
  nameEn: string;
  priceExtra: number;
  desc: string;
  icon: string; // emoji 或 icon 名
}

export const LENS_COATINGS: LensCoating[] = [
  { id: 'blue-cut', name: '防蓝光', nameEn: 'Blue Light Filter', priceExtra: 10, desc: '过滤有害蓝光，适合长时间用屏', icon: '🛡️' },
  { id: 'photochromic', name: '光致变色', nameEn: 'Photochromic', priceExtra: 25, desc: '室内透明，户外自动变墨镜', icon: '🕶️' },
  { id: 'anti-scratch', name: '防刮花', nameEn: 'Anti-Scratch', priceExtra: 8, desc: '增强镜片表面硬度，延长寿命', icon: '💎' },
  { id: 'hydrophobic', name: '防水防油', nameEn: 'Hydrophobic', priceExtra: 12, desc: '防水防指纹，易清洁', icon: '💧' },
  { id: 'uv-protection', name: 'UV400 防紫外线', nameEn: 'UV400 Protection', priceExtra: 0, desc: '100% 阻挡 UVA/UVB（已含）', icon: '☀️' },
];

// ─── 完整配置 ───
export interface LensConfiguration {
  step1: {
    lensType: LensType;
  };
  step2: {
    prescription: PrescriptionData;
  };
  step3: {
    pd: PDData;
  };
  step4: {
    lensIndex: LensIndex;
  };
  step5: {
    coatingIds: string[];
  };
}

// ─── 校验 ───
export interface StepValidation {
  valid: boolean;
  errors: Record<string, string>;
}

export function validatePrescription(rx: PrescriptionData): StepValidation {
  const errors: Record<string, string> = {};
  const sphRange = (v: number) => v >= -10 && v <= 10;
  const cylRange = (v: number) => v >= -6 && v <= 6;

  for (const eye of ['right', 'left'] as const) {
    const e = rx[eye];
    if (!sphRange(e.sph)) errors[`${eye}.sph`] = '球镜范围 -10.00 ~ +10.00';
    if (!cylRange(e.cyl)) errors[`${eye}.cyl`] = '柱镜范围 -6.00 ~ +6.00';
    if (e.cyl !== 0 && (e.axis < 0 || e.axis > 180)) errors[`${eye}.axis`] = '轴位 0~180';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validatePD(pd: PDData): StepValidation {
  const errors: Record<string, string> = {};
  if (pd.mode === 'single' && (pd.value < 50 || pd.value > 80)) {
    errors.pd = '瞳距范围 50~80mm';
  }
  if (pd.mode === 'dual') {
    if ((pd.left || 0) + (pd.right || 0) < 50 || (pd.left || 0) + (pd.right || 0) > 80) {
      errors.pd = '双瞳距总和 50~80mm';
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

// ─── 总价计算 ───
export function calcLensTotal(config: LensConfiguration, basePrice: number): number {
  let total = basePrice;
  total += config.step4.lensIndex.priceExtra;
  for (const cid of config.step5.coatingIds) {
    const c = LENS_COATINGS.find(x => x.id === cid);
    if (c) total += c.priceExtra;
  }
  return total;
}

// ─── 常用球镜预设值 ───
export const COMMON_SPH_PRESETS: number[] = [
  0, -0.50, -0.75, -1.00, -1.25, -1.50, -1.75, -2.00, -2.25, -2.50,
  -2.75, -3.00, -3.25, -3.50, -3.75, -4.00, -4.50, -5.00, -5.50, -6.00,
  -7.00, -8.00, -9.00, -10.00,
];

// ─── 常用柱镜预设值 ───
export const COMMON_CYL_PRESETS: number[] = [
  0, -0.50, -0.75, -1.00, -1.25, -1.50, -1.75, -2.00, -2.50, -3.00,
  -3.50, -4.00, -5.00, -6.00,
];

// ─── 常用轴位预设值 ───
export const COMMON_AXIS_PRESETS: number[] = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85,
  90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180,
];

// ─── 默认空配置 ───
export function createDefaultConfig(): LensConfiguration {
  return {
    step1: { lensType: 'non-prescription' as LensType },
    step2: { prescription: { right: { sph: 0, cyl: 0, axis: 0 }, left: { sph: 0, cyl: 0, axis: 0 } } },
    step3: { pd: { mode: 'single', value: 63 } },
    step4: { lensIndex: LENS_INDEXES[0] },
    step5: { coatingIds: ['uv-protection'] },
  };
}
