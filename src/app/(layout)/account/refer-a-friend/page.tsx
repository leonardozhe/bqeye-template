'use client';

import { useState } from 'react';
import {
  Container, Box, Typography, Button, TextField, Divider,
  IconButton, Collapse,
  Paper
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import MessengerIcon from '@mui/icons-material/MailOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function ReferAFriendPage() {
  const [referralLink] = useState('https://www.bqeye.com/?ref=YOUR_ID');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    if (email) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setEmail('');
    }
  };

  const rules = [
    '1. Share your referral link with friends.',
    '2. Your friend gets $20 in BQEye Points + a $7 new user coupon when they sign up through your link.',
    '3. You earn $10 (100 Z Points) when your friend makes their first purchase.',
    '4. You can earn up to $100/day in Z Points.',
    '5. Points are credited after the friend\'s order return period ends.',
    '6. 10 Z Points = $1. Points can be used to deduct up to 80% of your order amount.',
    '7. This offer cannot be combined with other referral promotions.',
  ];

  const socialLinks = [
    { name: 'Facebook', icon: <FacebookIcon sx={{ fontSize: 18 }} />, color: '#1877F2', href: 'https://www.facebook.com/sharer/sharer.php' },
    { name: 'X', icon: <XIcon sx={{ fontSize: 18 }} />, color: '#000000', href: 'https://twitter.com/intent/tweet' },
    { name: 'Messenger', icon: <MessengerIcon sx={{ fontSize: 18 }} />, color: '#0084FF', href: 'https://www.messenger.com' },
    { name: 'WhatsApp', icon: <WhatsAppIcon sx={{ fontSize: 18 }} />, color: '#25D366', href: 'https://api.whatsapp.com/send' },
  ];

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: 'calc(100vh - 96px)' }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* ─── Title ─── */}
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#282828', mb: 1, textAlign: 'center', fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Sharing is Saving: Refer a Friend
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#463AE8', mb: 4, textAlign: 'center', fontSize: { xs: '1.1rem', md: '1.35rem' } }}>
          & Earn $20 in BQEye Points!
        </Typography>

        {/* ─── How it works ─── */}
        <Box sx={{ display: 'flex', gap: 3, mb: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { step: '1', label: 'Share your link', color: '#463AE8' },
            { step: '2', label: 'Friend signs up & shops', color: '#7B68EE' },
            { step: '3', label: 'You earn $10 per friend', color: '#9370DB' },
          ].map((item) => (
            <Box key={item.step} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: item.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                {item.step}
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500, color: '#282828' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* ─── Rules ─── */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Button
            onClick={() => setShowRules(!showRules)}
            sx={{
              color: '#463AE8',
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '0.95rem',
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
            }}
            endIcon={showRules ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            Rules
          </Button>
          <Collapse in={showRules}>
            <Box sx={{ mt: 2, p: 2.5, bgcolor: '#fff', borderRadius: '8px', textAlign: 'left', maxWidth: 500, mx: 'auto', border: '1px solid #e8e8e8' }}>
              {rules.map((rule) => (
                <Typography key={rule} variant="body2" color="#555" sx={{ mb: 1, lineHeight: 1.7 }}>
                  {rule}
                </Typography>
              ))}
            </Box>
          </Collapse>
        </Box>

        {/* ─── Email Invite ─── */}
        <Paper sx={{ p: 3, borderRadius: '12px', mb: 4, bgcolor: '#fff', border: '1px solid #e8e8e8' }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#282828', mb: 2, textAlign: 'center' }}>
            Invite a friend via email
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, maxWidth: 450, mx: 'auto' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  bgcolor: '#f9f9f9',
                  '& fieldset': { borderColor: '#e0e0e0' },
                  '& input': { fontSize: '0.85rem' },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleInvite}
              sx={{
                bgcolor: '#463AE8',
                borderRadius: '8px',
                px: 3,
                fontWeight: 700,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#3a2fd4' },
              }}
            >
              Invite!
            </Button>
          </Box>
          {showSuccess && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 2 }}>
              <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: '1rem' }} />
              <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                Invitation sent!
              </Typography>
            </Box>
          )}
        </Paper>

        {/* ─── Referral Link ─── */}
        <Paper sx={{ p: 3, borderRadius: '12px', mb: 4, bgcolor: '#fff', border: '1px solid #e8e8e8' }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#282828', mb: 2, textAlign: 'center' }}>
            Your referral link
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, maxWidth: 500, mx: 'auto' }}>
            <Box
              sx={{
                flex: 1,
                p: 1.5,
                bgcolor: '#f9f9f9',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                fontSize: '0.85rem',
                color: '#555',
                wordBreak: 'break-all',
              }}
            >
              {referralLink}
            </Box>
            <Button
              variant="contained"
              onClick={handleCopy}
              sx={{
                bgcolor: copied ? '#4CAF50' : '#463AE8',
                borderRadius: '8px',
                px: 2,
                fontWeight: 700,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: copied ? '#43A047' : '#3a2fd4' },
              }}
            >
              {copied ? (
                <>
                  <CheckCircleIcon sx={{ mr: 0.5, fontSize: '1rem' }} /> Copied!
                </>
              ) : (
                <>
                  <ContentCopyIcon sx={{ mr: 0.5, fontSize: '1rem' }} /> Copy Link
                </>
              )}
            </Button>
          </Box>

          {/* Social share buttons */}
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
            {socialLinks.map((social) => (
              <IconButton
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: social.color,
                  color: '#fff',
                  width: 40,
                  height: 40,
                  '&:hover': { opacity: 0.85 },
                }}
                title={social.name}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Paper>

        {/* ─── Benefits ─── */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 4 }}>
          <Paper sx={{ p: 3, borderRadius: '12px', bgcolor: '#fff', border: '1px solid #e8e8e8', flex: 1, minWidth: 250 }}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#463AE8', mb: 1.5 }}>
              You Get
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['$10 (100 Z Points) per referral', 'Earn up to $100/day', 'No limit on total referrals'].map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: '1rem' }} />
                  <Typography variant="body2" color="#555">{item}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
          <Paper sx={{ p: 3, borderRadius: '12px', bgcolor: '#fff', border: '1px solid #e8e8e8', flex: 1, minWidth: 250 }}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#463AE8', mb: 1.5 }}>
              Your Friend Gets
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['$20 (200 Z Points)', '$7 new user coupon', 'Free shipping over $39'].map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: '1rem' }} />
                  <Typography variant="body2" color="#555">{item}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* ─── FAQ ─── */}
        <Paper sx={{ p: 3, borderRadius: '12px', bgcolor: '#fff', border: '1px solid #e8e8e8' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#282828', mb: 3, textAlign: 'center' }}>
            FAQ
          </Typography>
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            {[
              { q: 'How do I earn Z Points?', a: 'Share your referral link. When your friend signs up and makes their first purchase, you earn 100 Z Points ($10 value).' },
              { q: 'What does my friend get?', a: 'Your friend receives 200 Z Points ($20) plus a $7 new user coupon when they sign up through your link.' },
              { q: 'How much can I earn?', a: 'You can earn up to $100/day (1,000 Z Points). There is no limit on the total number of friends you can refer.' },
              { q: 'What are BQEye Points worth?', a: '10 Z Points = $1. Points can deduct up to 80% of your order amount at checkout.' },
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
          cursor: 'pointer',
          borderBottom: '1px solid #f0f0f0',
          '&:hover': { bgcolor: '#fafafa' },
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#282828', pr: 2 }}>
          {question}
        </Typography>
        {open ? <ExpandLessIcon sx={{ color: '#808080' }} /> : <ExpandMoreIcon sx={{ color: '#808080' }} />}
      </Box>
      <Collapse in={open}>
        <Box sx={{ pb: 2, pl: 2 }}>
          <Typography variant="body2" color="#808080" sx={{ lineHeight: 1.7 }}>
            {answer}
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
}
