import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, wide = false, children }) {
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={Boolean(isOpen)}
      onClose={onClose}
      transitionDuration={{ enter: 240, exit: 170 }}
      fullWidth
      maxWidth={wide ? 'md' : 'sm'}
      fullScreen={isSmallMobile}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(17, 18, 15, 0.56)',
            backdropFilter: 'blur(5px)',
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: isSmallMobile ? 0 : '24px',
          backgroundColor: '#F6F5F0',
          color: '#11120F',
          border: '1px solid rgba(17,18,15,0.12)',
          boxShadow: '0 28px 70px rgba(17, 18, 15, 0.28)',
          p: { xs: 0.5, sm: 1 },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          fontWeight: 800,
          fontSize: '1.1rem',
          borderBottom: '1px solid rgba(17,18,15,0.08)',
          pb: 1.5,
        }}
      >
        <span>{title}</span>
        <IconButton
          onClick={onClose}
          aria-label="Close modal"
          size="small"
          sx={{
            width: 34,
            height: 34,
            bgcolor: '#FFFFFF',
            border: '1px solid rgba(17,18,15,0.1)',
            color: '#11120F',
            '&:hover': { bgcolor: '#11120F', color: '#C7F36B' },
          }}
        >
          <X size={16} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: '18px !important', pb: 2.5 }}>{children}</DialogContent>
    </Dialog>
  );
}
