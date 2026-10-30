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
      fullWidth
      maxWidth={wide ? 'md' : 'sm'}
      fullScreen={isSmallMobile}
      PaperProps={{
        sx: {
          borderRadius: isSmallMobile ? 0 : '24px',
          backgroundColor: '#F6F5F0',
          color: '#11120F',
          border: '1px solid rgba(17,18,15,0.1)',
          p: { xs: 0.5, sm: 1 },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          fontWeight: 800,
          fontSize: '1.15rem',
          borderBottom: '1px solid rgba(17,18,15,0.08)',
          pb: 1.5,
        }}
      >
        <span>{title}</span>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close"
          sx={{
            bgcolor: 'rgba(17,18,15,0.06)',
            color: '#11120F',
            '&:hover': { bgcolor: '#11120F', color: '#C7F36B' },
          }}
        >
          <X size={18} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: '1.25rem !important' }}>{children}</DialogContent>
    </Dialog>
  );
}
