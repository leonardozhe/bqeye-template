'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Button, Typography, Paper, Stepper, Step, StepLabel,
  TextField, Chip, Divider, Alert, Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  LensConfiguration,
  LENS_INDEXES, LENS_COATINGS, LENS_TYPE_OPTIONS,
  COMMON_SPH_PRESETS, COMMON_CYL_PRESETS, COMMON_AXIS_PRESETS,
  validatePrescription, validatePD, calcLensTotal, createDefaultConfig,
  needsPrescription,
} from '@/lib/lensConfig';
import { useCartStore } from '@/lib/cartStore';
import type { FrontendProduct as Product } from '@/api/medusa-mappers';

const STEPS = [
  { label: '镜片类型', short: '类型' },
  { label: '处方数据', short: '处方' },
  { label: '瞳距 (PD)', short: '瞳距' },
  { label: '折射率', short: '折射率' },
  { label: '镀膜/附加', short: '镀膜' },
];

interface Props {
  product: Product;
  onComplete?: (config: LensConfiguration) => void;
}

export default function LensConfigWizard({ product, onComplete }: Props) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [activeStep, setActiveStep] = useState(0);
  const [config, setConfig] = useState<LensConfiguration>(createDefaultConfig());
  const [_errors, setErrors] = useState<Record<string, string>>({});

  // ─── Step 1: Lens Type (BQEye 6 types) ───
  const renderStep1 = () => (
    <Box>
      <Typography variant="body1" sx={{ fontWeight: 700, mb: 2 }}>选择镜片类型</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {LENS_TYPE_OPTIONS.map((type) => {
          const selected = config.step1.lensType === type.id;
          return (
            <Paper
              key={type.id}
              elevation={0}
              sx={{
                p: 2, border: '2px solid',
                borderColor: selected ? '#463AE8' : '#f0f0f0',
                borderRadius: '12px', cursor: 'pointer',
                bgcolor: selected ? '#F5F3FF' : '#fff',
                transition: 'all 0.2s',
              }}
              onClick={() => setConfig({ ...config, step1: { lensType: type.id } })}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: '2px solid',
                  borderColor: selected ? '#463AE8' : '#ccc',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {selected && (
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#463AE8' }} />
                  )}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{type.label}</Typography>
                  <Typography variant="body2" color="#808080">{type.desc}</Typography>
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );

  // ─── Degree selector chips ───
  const renderDegreeSelector = (eye: 'right' | 'left', field: 'sph' | 'cyl', presets: number[]) => {
    const data = config.step2.prescription[eye];
    const currentVal = data[field];
    const fieldLabel = field === 'sph' ? '球镜 (SPH)' : '柱镜 (CYL)';

    return (
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
          {eye === 'right' ? '右眼' : '左眼'} · {fieldLabel}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {presets.map((v) => {
            const selected = currentVal === v;
            return (
              <Chip
                key={v}
                label={v === 0 ? '0' : v.toFixed(2)}
                size="small"
                onClick={() => {
                  const rx = { ...config.step2.prescription };
                  rx[eye] = { ...data, [field]: v };
                  setConfig({ ...config, step2: { prescription: rx } });
                }}
                sx={{
                  borderRadius: '20px',
                  fontWeight: selected ? 700 : 500,
                  bgcolor: selected ? '#463AE8' : '#f5f5f5',
                  color: selected ? '#fff' : '#282828',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: selected ? '#3a2fd4' : '#e8e8e8' },
                }}
              />
            );
          })}
        </Box>
        <TextField
          size="small"
          label="自定义"
          type="number"
          inputProps={{ step: 0.25 }}
          value={currentVal}
          onChange={(e) => {
            const rx = { ...config.step2.prescription };
            rx[eye] = { ...data, [field]: parseFloat(e.target.value) || 0 };
            setConfig({ ...config, step2: { prescription: rx } });
          }}
          sx={{ mt: 0.5, width: 100, '& input': { p: '4px 8px', fontSize: '0.8rem' } }}
        />
      </Box>
    );
  };

  const renderAxisSelector = (eye: 'right' | 'left') => {
    const data = config.step2.prescription[eye];
    const hasCyl = data.cyl !== 0;
    return (
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
          {eye === 'right' ? '右眼' : '左眼'} · 轴位 (Axis)
          {!hasCyl && <Typography component="span" variant="caption" color="#808080" sx={{ fontWeight: 400, ml: 1 }}>（无散光时不需要）</Typography>}
        </Typography>
        {hasCyl ? (
          <>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {COMMON_AXIS_PRESETS.map((v) => (
                <Chip
                  key={v}
                  label={`${v}°`}
                  size="small"
                  onClick={() => {
                    const rx = { ...config.step2.prescription };
                    rx[eye] = { ...data, axis: v };
                    setConfig({ ...config, step2: { prescription: rx } });
                  }}
                  sx={{
                    borderRadius: '20px',
                    fontWeight: data.axis === v ? 700 : 500,
                    bgcolor: data.axis === v ? '#463AE8' : '#f5f5f5',
                    color: data.axis === v ? '#fff' : '#282828',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: data.axis === v ? '#3a2fd4' : '#e8e8e8' },
                  }}
                />
              ))}
            </Box>
            <TextField
              size="small"
              label="自定义"
              type="number"
              inputProps={{ step: 1, min: 0, max: 180 }}
              value={data.axis}
              onChange={(e) => {
                const rx = { ...config.step2.prescription };
                rx[eye] = { ...data, axis: Math.min(180, Math.max(0, parseInt(e.target.value) || 0)) };
                setConfig({ ...config, step2: { prescription: rx } });
              }}
              sx={{ mt: 0.5, width: 100, '& input': { p: '4px 8px', fontSize: '0.8rem' } }}
            />
          </>
        ) : (
          <Typography variant="caption" color="#808080">轴位: {data.axis}°</Typography>
        )}
      </Box>
    );
  };

  // ─── Step 2: Prescription ───
  const renderStep2 = () => {
    const needsRx = needsPrescription(config.step1.lensType);
    return (
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 700, mb: 2 }}>输入验光数据</Typography>
        {!needsRx ? (
          <Alert severity="info" sx={{ mb: 2, borderRadius: '8px' }}>
            {config.step1.lensType === 'non-prescription' ? '平光镜片已设为 0 度' : '此镜片类型无需处方数据'}
          </Alert>
        ) : (
          <>
            <Box sx={{ mb: 1, p: 1.5, bgcolor: '#F5F3FF', borderRadius: '10px' }}>
              {renderDegreeSelector('right', 'sph', COMMON_SPH_PRESETS)}
              {renderDegreeSelector('right', 'cyl', COMMON_CYL_PRESETS)}
              {renderAxisSelector('right')}
            </Box>
            <Box sx={{ mb: 1, p: 1.5, bgcolor: '#FFF8E1', borderRadius: '10px' }}>
              {renderDegreeSelector('left', 'sph', COMMON_SPH_PRESETS)}
              {renderDegreeSelector('left', 'cyl', COMMON_CYL_PRESETS)}
              {renderAxisSelector('left')}
            </Box>
          </>
        )}
      </Box>
    );
  };

  // ─── Step 3: PD ───
  const renderStep3 = () => (
    <Box>
      <Typography variant="body1" sx={{ fontWeight: 700, mb: 2 }}>瞳距 (PD)</Typography>
      <Typography variant="body2" color="#808080" sx={{ mb: 2 }}>两眼瞳孔中心之间的距离</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button variant={config.step3.pd.mode === 'single' ? 'contained' : 'outlined'} size="small" onClick={() => setConfig({ ...config, step3: { pd: { mode: 'single', value: config.step3.pd.value } } })} sx={{ borderRadius: '20px' }}>单瞳距</Button>
        <Button variant={config.step3.pd.mode === 'dual' ? 'contained' : 'outlined'} size="small" onClick={() => setConfig({ ...config, step3: { pd: { mode: 'dual', value: config.step3.pd.value, left: 31, right: 32 } } })} sx={{ borderRadius: '20px' }}>双瞳距</Button>
      </Box>
      {config.step3.pd.mode === 'single' ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button variant="outlined" size="small" onClick={() => setConfig({ ...config, step3: { pd: { ...config.step3.pd, value: Math.max(50, config.step3.pd.value - 1) } } })}>-1mm</Button>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#463AE8', minWidth: 80, textAlign: 'center' }}>{config.step3.pd.value}</Typography>
          <Typography variant="body2" color="#808080">mm</Typography>
          <Button variant="outlined" size="small" onClick={() => setConfig({ ...config, step3: { pd: { ...config.step3.pd, value: Math.min(80, config.step3.pd.value + 1) } } })}>+1mm</Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>左眼 PD</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Button variant="outlined" size="small" onClick={() => setConfig({ ...config, step3: { pd: { ...config.step3.pd, left: Math.max(25, (config.step3.pd.left || 31) - 1) } } })}>-1</Button>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#463AE8' }}>{config.step3.pd.left}</Typography>
              <Button variant="outlined" size="small" onClick={() => setConfig({ ...config, step3: { pd: { ...config.step3.pd, left: Math.min(40, (config.step3.pd.left || 31) + 1) } } })}>+1</Button>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>右眼 PD</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Button variant="outlined" size="small" onClick={() => setConfig({ ...config, step3: { pd: { ...config.step3.pd, right: Math.max(25, (config.step3.pd.right || 32) - 1) } } })}>-1</Button>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#463AE8' }}>{config.step3.pd.right}</Typography>
              <Button variant="outlined" size="small" onClick={() => setConfig({ ...config, step3: { pd: { ...config.step3.pd, right: Math.min(40, (config.step3.pd.right || 32) + 1) } } })}>+1</Button>
            </Box>
          </Grid>
        </Grid>
      )}
      <Alert severity="info" sx={{ mt: 2, borderRadius: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoOutlinedIcon fontSize="small" />
          <Typography variant="caption">不知瞳距？可查看验光单或咨询验光师</Typography>
        </Box>
      </Alert>
    </Box>
  );

  // ─── Step 4: Lens Index ───
  const renderStep4 = () => (
    <Box>
      <Typography variant="body1" sx={{ fontWeight: 700, mb: 2 }}>选择折射率</Typography>
      <Grid container spacing={1.5}>
        {LENS_INDEXES.map((idx) => {
          const selected = config.step4.lensIndex.value === idx.value;
          return (
            <Grid size={{ xs: 6 }} key={idx.value}>
              <Paper elevation={0} onClick={() => setConfig({ ...config, step4: { lensIndex: idx } })} sx={{ p: 1.5, border: '2px solid', borderRadius: '12px', cursor: 'pointer', borderColor: selected ? '#463AE8' : '#f0f0f0', bgcolor: selected ? '#F5F3FF' : '#fff', transition: 'all 0.2s', position: 'relative' }}>
                {selected && <CheckCircleIcon sx={{ position: 'absolute', top: 8, right: 8, color: '#463AE8', fontSize: 20 }} />}
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{idx.label}</Typography>
                <Typography variant="caption" color="#808080" sx={{ display: 'block' }}>{idx.desc}</Typography>
                <Typography variant="caption" color="#463AE8">{idx.suitableFor}</Typography>
                {idx.priceExtra > 0 ? <Typography variant="caption" sx={{ fontWeight: 700, color: '#463AE8', display: 'block', mt: 0.5 }}>+${idx.priceExtra.toFixed(2)}</Typography> : <Chip label="免费" size="small" sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', mt: 0.5, fontWeight: 700, fontSize: '0.65rem' }} />}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  // ─── Step 5: Coatings ───
  const renderStep5 = () => {
    const toggleCoating = (id: string) => {
      const ids = config.step5.coatingIds.includes(id) ? config.step5.coatingIds.filter((c) => c !== id) : [...config.step5.coatingIds, id];
      setConfig({ ...config, step5: { coatingIds: ids } });
    };
    return (
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 700, mb: 2 }}>镀膜和附加功能</Typography>
        {LENS_COATINGS.map((coating) => {
          const selected = config.step5.coatingIds.includes(coating.id);
          return (
            <Paper key={coating.id} elevation={0} onClick={() => toggleCoating(coating.id)} sx={{ p: 1.5, mb: 1, border: '2px solid', borderRadius: '12px', cursor: 'pointer', borderColor: selected ? '#463AE8' : '#f0f0f0', bgcolor: selected ? '#F5F3FF' : '#fff', display: 'flex', alignItems: 'center', gap: 1.5, transition: 'all 0.2s' }}>
              <Typography variant="h4">{coating.icon}</Typography>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{coating.name}</Typography>
                <Typography variant="caption" color="#808080">{coating.desc}</Typography>
              </Box>
              {coating.priceExtra > 0 ? <Typography variant="caption" sx={{ fontWeight: 700, color: '#463AE8', whiteSpace: 'nowrap' }}>+${coating.priceExtra.toFixed(2)}</Typography> : <Chip label="已含" size="small" sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 700, fontSize: '0.65rem' }} />}
            </Paper>
          );
        })}
      </Box>
    );
  };

  const stepRenderers = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5];

  const canProceed = (): boolean => {
    setErrors({});
    switch (activeStep) {
      case 1: {
        if (needsPrescription(config.step1.lensType)) {
          const v = validatePrescription(config.step2.prescription);
          if (!v.valid) setErrors(v.errors);
          return v.valid;
        }
        return true;
      }
      case 2: {
        const v = validatePD(config.step3.pd);
        if (!v.valid) setErrors(v.errors);
        return v.valid;
      }
      default: return true;
    }
  };

  const handleNext = () => { if (canProceed()) setActiveStep((s) => s + 1); };
  const handleBack = () => setActiveStep((s) => s - 1);

  const handleComplete = () => {
    const total = calcLensTotal(config, product.price);
    addItem({
      ...product,
      price: total,
      name: `${product.name} (配镜)`,
      lensConfig: config,
    } as any);
    if (onComplete) onComplete(config);
    router.push('/cart');
  };

  const lensTotal = calcLensTotal(config, product.price);

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #f0f0f0', bgcolor: '#fff' }}>
      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {STEPS.map((step, i) => (
          <Step key={i}>
            <StepLabel StepIconProps={{ sx: { color: i <= activeStep ? '#463AE8' : '#ccc' } }}>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: i <= activeStep ? '#463AE8' : '#999' }}>
                {step.short}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step content */}
      <Box sx={{ minHeight: 350 }}>
        {stepRenderers[activeStep]()}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          {activeStep > 0 && (
            <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ color: '#808080' }}>
              上一步
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="#808080">
            镜片合计:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#463AE8' }}>
            ${lensTotal.toFixed(2)}
          </Typography>

          {activeStep < 4 ? (
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={handleNext}
              sx={{ bgcolor: '#463AE8', borderRadius: '20px', px: 3 }}
            >
              下一步
            </Button>
          ) : (
            <Button
              variant="contained"
              endIcon={<CheckCircleIcon />}
              onClick={handleComplete}
              sx={{ bgcolor: '#4CAF50', borderRadius: '20px', px: 3 }}
            >
              加入购物车
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
