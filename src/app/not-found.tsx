import { Box, Typography, Button, Container } from '@mui/material';

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center' }}
      >
        <Typography
          variant="h1"
          sx={{ fontSize: '8rem', fontWeight: 700, color: '#463AE8', lineHeight: 1 }}
        >
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, mt: 2 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="#808080" sx={{ mb: 4 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          size="large"
          href="/"
          sx={{
            bgcolor: '#463AE8',
            borderRadius: '999px',
            '&:hover': { bgcolor: '#3a2fd4' } }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}
