'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, Paper, Stepper, Step, StepLabel, TextField, Chip, IconButton, Divider, Alert, Grid, Rating, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import {
  LensConfiguration,
  LENS_INDEXES, LENS_COATINGS, LENS_TYPE_OPTIONS,
  COMMON_SPH_PRESETS, COMMON_CYL_PRESETS, COMMON_AXIS_PRESETS,
  validatePrescription, validatePD, calcLensTotal, createDefaultConfig,
  needsPrescription,
} from '@/lib/lensConfig';
import { useCartStore } from '@/lib/cartStore';
import { Product } from '@/lib/products';

const STEPS = [
  { label: '镜片类型', short: '类型' },
  { label: '处方数据', short: '处方' },
  { label: '瞳距 (PD)', short: '瞳距' },
  { label: '折射率', short: '折射率' },
  { label: '镀膜/附加', short: '镀膜' },
];

const DETAIL_TABS = ['Product Details', 'Product Description', 'Lens Details', 'Shipping & Returns', 'Reviews'];

interface Props {
  product: Product;
}

export default function ProductDetail({ product }: Props) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  // ─── Lens config state ───
  const [showLensConfig, setShowLensConfig] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [config, setConfig] = useState<LensConfiguration>(createDefaultConfig());
  const [_errors, setErrors] = useState<Record<string, string>>({});
  const [selectedColor, setSelectedColor] = useState(0);
  const [detailTab, setDetailTab] = useState(0);

  // ─── Quantity ───
  const [quantity, _setQuantity] = useState(1);
  const [_added, setAdded] = useState(false);

  const lensTotal = calcLensTotal(config, product.price);

  // ─── Degree selector chips ───
  const renderDegreeSelector = (eye: 'right' | 'left', field: 'sph' | 'cyl', presets: number[]) => {
    const data = config.step2.prescription[eye];
    const currentVal = data[field];
    const fieldLabel = field === 'sph' ? 'SPH (球镜)' : 'CYL (柱镜)';

    return (
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: '#282828' }}>
          {eye === 'right' ? '右眼 OD' : '左眼 OS'} · {fieldLabel}
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
                  borderRadius: '8px',
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
        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: '#282828' }}>
          {eye === 'right' ? '右眼 OD' : '左眼 OS'} · Axis (轴位)
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
                    borderRadius: '8px',
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
          <Typography variant="caption" color="#808080">Axis: {data.axis}°</Typography>
        )}
      </Box>
    );
  };

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

  const handleLensConfigDone = () => {
    const total = calcLensTotal(config, product.price);
    addItem({ ...product, price: total, name: `${product.name} (配镜)`, lensConfig: config } as any);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setShowLensConfig(false);
    setActiveStep(0);
  };

  const _handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const _handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    router.push('/checkout');
  };

  // ─── Review mock data ───
  const reviews = [
    { name: 'Sarah M.', rating: 5, date: '2 weeks ago', text: 'Absolutely love these lenses! The color is so natural and they\'re super comfortable.', hasImage: false },
    { name: 'Mike T.', rating: 4, date: '1 month ago', text: 'Great quality for the price. Color is slightly different from the photo but still looks amazing.', hasImage: false },
  ];

  return (
    <Box>
      {/* ═══════════════════════════════════════════════
          TOP SECTION: Gallery + Product Info (2 columns)
         ═══════════════════════════════════════════════ */}
      <Grid container spacing={{ xs: 2, md: 4 }}>
        {/* ─── LEFT: Gallery ─── */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Main image */}
          <Box
            sx={{
              position: 'relative',
              paddingTop: '100%',
              borderRadius: 0,
              overflow: 'hidden',
              bgcolor: '#f5f5f5',
              mb: 1,
            }}
          >
            <Box
              component="img"
              src={product.images[selectedColor] || product.image}
              alt={product.name}
              sx={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>
          {/* Thumbnails - horizontal scroll */}
          <Box sx={{ display: 'flex', gap: 0.75, overflowX: 'auto', pb: 1 }}>
            {product.images.map((img, i) => (
              <Box
                key={i}
                onClick={() => setSelectedColor(i)}
                sx={{
                  width: 60, height: 60,
                  borderRadius: 0,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: selectedColor === i ? '2px solid #282828' : '2px solid transparent',
                  flexShrink: 0,
                  bgcolor: '#f5f5f5',
                  transition: 'border-color 0.2s',
                }}
              >
                <Box component="img" src={img} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            ))}
          </Box>
        </Grid>

        {/* ─── RIGHT: Product Info ─── */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Product Title (h1) */}
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
            {product.name}
          </Typography>

          {/* SKU/ID */}
          <Typography variant="caption" sx={{ color: '#808080', mb: 1, display: 'block' }}>
            SKU: ZJGA{product.id}
          </Typography>

          {/* Subtitle (h2) */}
          <Typography variant="h6" sx={{ fontWeight: 400, color: '#808080', mb: 1.5, fontSize: '1rem' }}>
            {product.description.split('.')[0]}
          </Typography>

          {/* Rating + Reviews */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Rating value={product.rating} precision={0.5} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#FFB800' } }} />
            <Typography variant="body2" sx={{ color: '#282828' }}>
              {product.rating} ({product.reviews} Reviews)
            </Typography>
          </Box>

          {/* Coupon badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Chip
              icon={<LocalOfferIcon sx={{ color: '#fff' }} />}
              label={`$7 OFF · First Order`}
              size="small"
              sx={{ bgcolor: '#463AE8', color: '#fff', fontWeight: 700, fontSize: '0.75rem' }}
            />
            <Button size="small" sx={{ color: '#463AE8', fontWeight: 700, fontSize: '0.75rem', textTransform: 'none' }}>
              Coupons
            </Button>
          </Box>

          {/* Color variants */}
          {product.colors && product.colors.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#282828' }}>
                {product.colors[selectedColor]?.name || 'Color'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {product.colors.map((color, i) => (
                  <Box
                    key={color.name}
                    onClick={() => setSelectedColor(i)}
                    sx={{
                      width: 48, height: 48,
                      borderRadius: '4px',
                      bgcolor: color.hex,
                      border: color.hex === '#FFFFFF' || color.hex === '#D3D3D3' ? '1px solid #ddd' : 'none',
                      cursor: 'pointer',
                      outline: selectedColor === i ? '2px solid #282828' : '2px solid transparent',
                      outlineOffset: '2px',
                      transition: 'outline 0.2s',
                    }}
                    title={color.name}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Price */}
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 3 }}>
            <Typography variant="h4" sx={{ color: '#463AE8', fontWeight: 700 }}>
              ${product.price.toFixed(2)}
            </Typography>
            {product.originalPrice > product.price && (
              <Typography variant="body1" sx={{ color: '#808080', textDecoration: 'line-through' }}>
                ${product.originalPrice.toFixed(2)}
              </Typography>
            )}
          </Box>

          {/* ─── Lens Configuration Buttons ─── */}
          {!showLensConfig ? (
            <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => { setShowLensConfig(true); setActiveStep(0); }}
                sx={{
                  bgcolor: '#463AE8',
                  borderRadius: '4px',
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  '&:hover': { bgcolor: '#3a2fd4' },
                }}
              >
                Select Lenses
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => {
                  // Frame only - add without lens config
                  for (let i = 0; i < quantity; i++) addItem(product);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 2000);
                }}
                sx={{
                  borderRadius: '4px',
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  borderColor: '#282828',
                  color: '#282828',
                  '&:hover': { bgcolor: '#f5f5f5', borderColor: '#282828' },
                }}
              >
                Frame Only
              </Button>
            </Box>
          ) : (
            <Paper elevation={0} sx={{ mb: 3, borderRadius: '4px', border: '1px solid #e0e0e0', bgcolor: '#fff' }}>
              {/* Mini stepper */}
              <Stepper activeStep={activeStep} alternativeLabel sx={{ px: 2, pt: 2, mb: 1 }}>
                {STEPS.map((step, i) => (
                  <Step key={i}>
                    <StepLabel StepIconProps={{ sx: { color: i <= activeStep ? '#463AE8' : '#ccc' } }}>
                      <Typography variant="caption" sx={{ fontSize: '0.65rem', color: i <= activeStep ? '#463AE8' : '#999' }}>
                        {step.short}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step content */}
              <Box sx={{ minHeight: 280, maxHeight: 500, overflowY: 'auto', px: 2, pb: 1 }}>
                {activeStep === 0 && (
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 2, color: '#282828' }}>Prescription Type</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {LENS_TYPE_OPTIONS.map((type) => {
                        const selected = config.step1.lensType === type.id;
                        return (
                          <Paper
                            key={type.id}
                            elevation={0}
                            sx={{
                              p: 1.5, border: '1px solid',
                              borderColor: selected ? '#463AE8' : '#e0e0e0',
                              borderRadius: '4px', cursor: 'pointer',
                              bgcolor: selected ? '#F5F3FF' : '#fff',
                              transition: 'all 0.15s',
                            }}
                            onClick={() => setConfig({ ...config, step1: { lensType: type.id } })}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Box sx={{
                                width: 18, height: 18, borderRadius: '50%',
                                border: '2px solid',
                                borderColor: selected ? '#463AE8' : '#ccc',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                              }}>
                                {selected && (
                                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#463AE8' }} />
                                )}
                              </Box>
                              <Box>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#282828' }}>{type.label}</Typography>
                                <Typography variant="body2" color="#808080">{type.desc}</Typography>
                              </Box>
                            </Box>
                          </Paper>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {activeStep === 1 && (
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 2, color: '#282828' }}>Prescription Data</Typography>
                    {needsPrescription(config.step1.lensType) ? (
                      <>
                        <Box sx={{ mb: 1, p: 1.5, bgcolor: '#f9f9ff', borderRadius: '4px' }}>
                          {renderDegreeSelector('right', 'sph', COMMON_SPH_PRESETS)}
                          {renderDegreeSelector('right', 'cyl', COMMON_CYL_PRESETS)}
                          {renderAxisSelector('right')}
                        </Box>
                        <Box sx={{ mb: 1, p: 1.5, bgcolor: '#fffdf5', borderRadius: '4px' }}>
                          {renderDegreeSelector('left', 'sph', COMMON_SPH_PRESETS)}
                          {renderDegreeSelector('left', 'cyl', COMMON_CYL_PRESETS)}
                          {renderAxisSelector('left')}
                        </Box>
                      </>
                    ) : (
                      <Alert severity="info" sx={{ borderRadius: '4px' }}>
                        {config.step1.lensType === 'non-prescription' ? 'No prescription needed' : 'No prescription data required for this lens type'}
                      </Alert>
                    )}
                  </Box>
                )}

                {activeStep === 2 && (
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 2, color: '#282828' }}>Pupillary Distance (PD)</Typography>
                    <Typography variant="body2" color="#808080" sx={{ mb: 2 }}>Distance between pupil centers</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Button variant={config.step3.pd.mode === 'single' ? 'contained' : 'outlined'} size="small" onClick={() => setConfig({ ...config, step3: { pd: { mode: 'single', value: config.step3.pd.value } } })} sx={{ borderRadius: '4px' }}>Single PD</Button>
                      <Button variant={config.step3.pd.mode === 'dual' ? 'contained' : 'outlined'} size="small" onClick={() => setConfig({ ...config, step3: { pd: { mode: 'dual', value: config.step3.pd.value, left: 31, right: 32 } } })} sx={{ borderRadius: '4px' }}>Dual PD</Button>
                    </Box>
                    {config.step3.pd.mode === 'single' ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button variant="outlined" size="small" onClick={() => setConfig({ ...config, step3: { pd: { ...config.step3.pd, value: Math.max(50, config.step3.pd.value - 1) } } })}>-1</Button>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#463AE8', minWidth: 80, textAlign: 'center' }}>{config.step3.pd.value}</Typography>
                        <Typography variant="body2" color="#808080">mm</Typography>
                        <Button variant="outlined" size="small" onClick={() => setConfig({ ...config, step3: { pd: { ...config.step3.pd, value: Math.min(80, config.step3.pd.value + 1) } } })}>+1</Button>
                      </Box>
                    ) : (
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>Left PD</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Button variant="outlined" size="small" onClick={() => setConfig({ ...config, step3: { pd: { ...config.step3.pd, left: Math.max(25, (config.step3.pd.left || 31) - 1) } } })}>-1</Button>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#463AE8' }}>{config.step3.pd.left}</Typography>
                            <Button variant="outlined" size="small" onClick={() => setConfig({ ...config, step3: { pd: { ...config.step3.pd, left: Math.min(40, (config.step3.pd.left || 31) + 1) } } })}>+1</Button>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>Right PD</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Button variant="outlined" size="small" onClick={() => setConfig({ ...config, step3: { pd: { ...config.step3.pd, right: Math.max(25, (config.step3.pd.right || 32) - 1) } } })}>-1</Button>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#463AE8' }}>{config.step3.pd.right}</Typography>
                            <Button variant="outlined" size="small" onClick={() => setConfig({ ...config, step3: { pd: { ...config.step3.pd, right: Math.min(40, (config.step3.pd.right || 32) + 1) } } })}>+1</Button>
                          </Box>
                        </Grid>
                      </Grid>
                    )}
                    <Alert severity="info" sx={{ mt: 2, borderRadius: '4px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InfoOutlinedIcon fontSize="small" />
                        <Typography variant="caption">Don't know your PD? Check your prescription or ask your optometrist</Typography>
                      </Box>
                    </Alert>
                  </Box>
                )}

                {activeStep === 3 && (
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 2, color: '#282828' }}>Lens Index</Typography>
                    <Grid container spacing={1}>
                      {LENS_INDEXES.map((idx) => {
                        const selected = config.step4.lensIndex.value === idx.value;
                        return (
                          <Grid size={{ xs: 6 }} key={idx.value}>
                            <Paper elevation={0} onClick={() => setConfig({ ...config, step4: { lensIndex: idx } })} sx={{ p: 1.5, border: '1px solid', borderRadius: '4px', cursor: 'pointer', borderColor: selected ? '#463AE8' : '#e0e0e0', bgcolor: selected ? '#F5F3FF' : '#fff', transition: 'all 0.15s', position: 'relative' }}>
                              {selected && <CheckCircleIcon sx={{ position: 'absolute', top: 6, right: 6, color: '#463AE8', fontSize: 18 }} />}
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#282828' }}>{idx.label}</Typography>
                              <Typography variant="caption" color="#808080" sx={{ display: 'block' }}>{idx.desc}</Typography>
                              <Typography variant="caption" color="#463AE8">{idx.suitableFor}</Typography>
                              {idx.priceExtra > 0 ? <Typography variant="caption" sx={{ fontWeight: 700, color: '#463AE8', display: 'block', mt: 0.5 }}>+${idx.priceExtra.toFixed(2)}</Typography> : <Chip label="FREE" size="small" sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', mt: 0.5, fontWeight: 700, fontSize: '0.65rem' }} />}
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}

                {activeStep === 4 && (
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 2, color: '#282828' }}>Lens Coatings & Add-ons</Typography>
                    {LENS_COATINGS.map((coating) => {
                      const selected = config.step5.coatingIds.includes(coating.id);
                      return (
                        <Paper key={coating.id} elevation={0} onClick={() => {
                          const ids = config.step5.coatingIds.includes(coating.id)
                            ? config.step5.coatingIds.filter((c) => c !== coating.id)
                            : [...config.step5.coatingIds, coating.id];
                          setConfig({ ...config, step5: { coatingIds: ids } });
                        }} sx={{ p: 1.5, mb: 0.75, border: '1px solid', borderRadius: '4px', cursor: 'pointer', borderColor: selected ? '#463AE8' : '#e0e0e0', bgcolor: selected ? '#F5F3FF' : '#fff', display: 'flex', alignItems: 'center', gap: 1.5, transition: 'all 0.15s' }}>
                          <Typography variant="h4">{coating.icon}</Typography>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#282828' }}>{coating.name}</Typography>
                            <Typography variant="caption" color="#808080">{coating.desc}</Typography>
                          </Box>
                          {coating.priceExtra > 0 ? <Typography variant="caption" sx={{ fontWeight: 700, color: '#463AE8', whiteSpace: 'nowrap' }}>+${coating.priceExtra.toFixed(2)}</Typography> : <Chip label="INCLUDED" size="small" sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 700, fontSize: '0.6rem' }} />}
                        </Paper>
                      );
                    })}
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 1 }} />

              {/* Navigation */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 2 }}>
                <Box>
                  {activeStep > 0 ? (
                    <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ color: '#808080', textTransform: 'none' }}>Back</Button>
                  ) : (
                    <Button startIcon={<ArrowBackIcon />} onClick={() => setShowLensConfig(false)} sx={{ color: '#808080', textTransform: 'none' }}>Back</Button>
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#463AE8' }}>
                    ${lensTotal.toFixed(2)}
                  </Typography>
                  {activeStep < 4 ? (
                    <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleNext} sx={{ bgcolor: '#463AE8', borderRadius: '4px', textTransform: 'none', fontWeight: 700 }}>Next</Button>
                  ) : (
                    <Button variant="contained" endIcon={<CheckCircleIcon />} onClick={handleLensConfigDone} sx={{ bgcolor: '#4CAF50', borderRadius: '4px', textTransform: 'none', fontWeight: 700 }}>Add to Cart</Button>
                  )}
                </Box>
              </Box>
            </Paper>
          )}

          {/* Wishlist */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <IconButton sx={{ color: '#808080', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
              <FavoriteBorderIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" sx={{ color: '#808080' }}>Add to Wishlist</Typography>
          </Box>

          {/* Services & Guarantees / Prescription Accordions — Zeelool style: no borders */}
          <Box sx={{ mt: 3 }}>
            <Accordion defaultExpanded sx={{ border: 'none', boxShadow: 'none', mb: 0, '&:before': { display: 'none' }, bgcolor: 'transparent' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#282828', fontSize: '1rem' }}>Services & Guarantees</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0, pt: 0 }}>
                <Typography variant="body2" sx={{ color: '#808080', lineHeight: 2.2 }}>
                  ✓ 30-Day Money Back Guarantee
                  <br />✓ 120-Day Warranty
                  <br />✓ Free Shipping Over $39
                  <br />✓ Secure Payment
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ border: 'none', boxShadow: 'none', mb: 0, '&:before': { display: 'none' }, bgcolor: 'transparent' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#282828', fontSize: '1rem' }}>Prescription</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0, pt: 0 }}>
                <Typography variant="body2" sx={{ color: '#808080', lineHeight: 1.8 }}>
                  Click &quot;Select Lenses&quot; above to configure your prescription, or choose &quot;Frame Only&quot; to purchase without lenses.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Grid>
      </Grid>

      {/* ═══════════════════════════════════════════════
          BOTTOM SECTION: Detail Tabs (full width)
         ═══════════════════════════════════════════════ */}
      <Box sx={{ mt: 6, mb: 4 }}>
        {/* Tabs - centered, Zeelool style */}
        <Box sx={{ borderBottom: '1px solid #e0e0e0' }}>
          <Tabs
            value={detailTab}
            onChange={(_, v) => setDetailTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                color: '#808080',
                fontSize: '0.95rem',
                minHeight: 48,
              },
              '& .Mui-selected': {
                color: '#282828',
              },
              '& .MuiTabs-indicator': {
                bgcolor: '#282828',
                height: 2,
              },
            }}
          >
            {DETAIL_TABS.map((tab, i) => (
              <Tab key={i} label={tab} />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ py: 5, px: { xs: 0, md: 4 } }}>
          {detailTab === 0 && (
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#282828' }}>Product Details</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                  {[
                    { label: 'Shape', value: 'Rectangle' },
                    { label: 'Material', value: 'Acetate' },
                    { label: 'Frame Type', value: 'Full Frame' },
                    { label: 'Frame Width', value: '140mm' },
                    { label: 'Lens Width', value: '52mm' },
                    { label: 'Bridge Width', value: '18mm' },
                    { label: 'Temple Length', value: '145mm' },
                    { label: 'Lens Height', value: '42mm' },
                  ].map((item) => (
                    <Box key={item.label}>
                      <Typography variant="body2" sx={{ color: '#808080', mb: 0.5, fontSize: '0.9rem' }}>{item.label}</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#282828', fontSize: '1rem' }}>{item.value}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ bgcolor: '#f5f5f5', borderRadius: '8px', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1" color="#808080">Frame Size Diagram</Typography>
                </Box>
              </Grid>
            </Grid>
          )}

          {detailTab === 1 && (
            <Box sx={{ maxWidth: 800 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#282828' }}>Product Description</Typography>
              <Typography variant="body1" color="#555" sx={{ lineHeight: 2, fontSize: '1rem' }}>
                {product.description}
              </Typography>
              <Typography variant="body1" color="#555" sx={{ lineHeight: 2, mt: 3, fontSize: '1rem' }}>
                Made with high-quality acetate material for durability and comfort. Suitable for everyday wear.
                The classic rectangle shape complements most face shapes.
              </Typography>
            </Box>
          )}

          {detailTab === 2 && (
            <Box sx={{ maxWidth: 800 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#282828' }}>Lens Details</Typography>
              <Grid container spacing={3}>
                {[
                  { title: 'Single Vision', desc: 'One prescription strength across the entire lens' },
                  { title: 'Lens Index 1.56', desc: 'Standard index, suitable for mild prescriptions' },
                  { title: 'Anti-Reflective Coating', desc: 'Reduces glare and reflections' },
                  { title: 'UV Protection', desc: '100% UVA/UVB protection included' },
                  { title: 'Scratch Resistant', desc: 'Hard coating for enhanced durability' },
                ].map((item) => (
                  <Box key={item.title} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 1, color: '#282828', fontSize: '1rem' }}>{item.title}</Typography>
                    <Typography variant="body1" sx={{ color: '#808080', fontSize: '0.95rem' }}>{item.desc}</Typography>
                  </Box>
                ))}
              </Grid>
            </Box>
          )}

          {detailTab === 3 && (
            <Box sx={{ maxWidth: 800 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#282828' }}>Shipping & Returns</Typography>
              <Typography variant="body1" color="#555" sx={{ lineHeight: 2.2, fontSize: '1rem' }}>
                📦 <strong>Free Standard Shipping</strong> on orders over $39.00<br />
                🚚 Standard delivery: 7-14 business days<br />
                ✈️ Express delivery: 3-7 business days ($14.99)<br />
                🔄 30-Day Money Back Guarantee<br />
                📋 120-Day Warranty on all products<br />
                🌍 Worldwide shipping available
              </Typography>
            </Box>
          )}

          {detailTab === 4 && (
            <Box>
              {/* Review summary */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 5 }}>
                <Typography variant="h2" sx={{ fontWeight: 700, color: '#282828' }}>{product.rating}</Typography>
                <Box>
                  <Rating value={product.rating} precision={0.5} readOnly sx={{ '& .MuiRating-iconFilled': { color: '#FFB800' } }} />
                  <Typography variant="body1" sx={{ color: '#808080', mt: 0.5, fontSize: '1rem' }}>Based on {product.reviews} Reviews</Typography>
                </Box>
              </Box>

              {/* Review filters */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
                <Chip label={`All (${reviews.length})`} sx={{ bgcolor: '#282828', color: '#fff', fontWeight: 600 }} />
                <Chip label="Images (0)" variant="outlined" />
              </Box>

              {/* Review list */}
              {reviews.map((review, i) => (
                <Box key={i} sx={{ py: 4, borderTop: i === 0 ? 'none' : '1px solid #f0f0f0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{review.name}</Typography>
                    <Typography variant="body2" color="#808080">{review.date}</Typography>
                  </Box>
                  <Rating value={review.rating} readOnly sx={{ mb: 2, '& .MuiRating-iconFilled': { color: '#FFB800' } }} />
                  <Typography variant="body1" color="#555" sx={{ lineHeight: 1.8, fontSize: '1rem' }}>{review.text}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
