import { memo, useEffect, forwardRef } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

import { varAlpha, stylesMode } from 'src/theme/styles';

import { imageClasses } from 'src/components/image';

import { kanbanClasses } from '../classes';

// ----------------------------------------------------------------------

export const StyledItemWrap = styled(ListItem)(() => ({
  '@keyframes fadeIn': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
  transform:
    'translate3d(var(--translate-x, 0), var(--translate-y, 0), 0) scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1))',
  transformOrigin: '0 0',
  touchAction: 'manipulation',
  [`&.${kanbanClasses.state.fadeIn}`]: { animation: 'fadeIn 500ms ease' },
  [`&.${kanbanClasses.state.dragOverlay}`]: { zIndex: 999 },
}));

export const StyledItem = styled(Stack)(({ theme }) => ({
  width: '100%',
  cursor: 'grab',
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  transformOrigin: '50% 50%',
  touchAction: 'manipulation',
  boxShadow: theme.customShadows.z1,
  borderRadius: 'var(--item-radius)',
  WebkitTapHighlightColor: 'transparent',
  backgroundColor: theme.vars.palette.common.white,
  transition: theme.transitions.create(['box-shadow']),
  [stylesMode.dark]: { backgroundColor: theme.vars.palette.grey[900] },
  [`&.${kanbanClasses.state.disabled}`]: {},
  [`&.${kanbanClasses.state.sorting}`]: {},
  [`&.${kanbanClasses.state.dragOverlay}`]: {
    backdropFilter: `blur(6px)`,
    boxShadow: theme.customShadows.z20,
    backgroundColor: varAlpha(theme.vars.palette.common.whiteChannel, 0.48),
    [stylesMode.dark]: { backgroundColor: varAlpha(theme.vars.palette.grey['900Channel'], 0.48) },
  },
  [`&.${kanbanClasses.state.dragging}`]: { opacity: 0.2, filter: 'grayscale(1)' },
}));

const ItemBase = forwardRef(({ task, stateProps, sx, ...other }, ref) => {
  const theme = useTheme();

  useEffect(() => {
    if (!stateProps?.dragOverlay) {
      return;
    }

    document.body.style.cursor = 'grabbing';

    // eslint-disable-next-line consistent-return
    return () => {
      document.body.style.cursor = '';
    };
  }, [stateProps?.dragOverlay]);

  const itemWrapClassName = kanbanClasses.itemWrap.concat(
    (stateProps?.fadeIn && ` ${kanbanClasses.state.fadeIn}`) ||
      (stateProps?.dragOverlay && ` ${kanbanClasses.state.dragOverlay}`) ||
      ''
  );

  const itemClassName = kanbanClasses.item.concat(
    (stateProps?.dragging && ` ${kanbanClasses.state.dragging}`) ||
      (stateProps?.disabled && ` ${kanbanClasses.state.disabled}`) ||
      (stateProps?.sorting && ` ${kanbanClasses.state.sorting}`) ||
      (stateProps?.dragOverlay && ` ${kanbanClasses.state.dragOverlay}`) ||
      ''
  );

  const renderImg = !!task?.attachments?.length && (
    <Box sx={{ p: theme.spacing(1, 1, 0, 1) }}>
      <Box
        component="img"
        className={imageClasses.root}
        alt={task?.attachments?.[0]}
        src={task?.attachments?.[0]}
        sx={{
          width: 320,
          height: 'auto',
          borderRadius: 1.5,
          aspectRatio: '4/3',
          objectFit: 'cover',
        }}
      />
    </Box>
  );


  return (
    <StyledItemWrap
      ref={ref}
      disablePadding
      className={itemWrapClassName}
      sx={{
        ...(!!stateProps?.transition && { transition: stateProps.transition }),
        ...(!!stateProps?.transform && {
          '--translate-x': `${Math.round(stateProps.transform.x)}px`,
          '--translate-y': `${Math.round(stateProps.transform.y)}px`,
          '--scale-x': `${stateProps.transform.scaleX}`,
          '--scale-y': `${stateProps.transform.scaleY}`,
        }),
      }}
    >
      <StyledItem
        className={itemClassName}
        data-cypress="draggable-item"
        sx={sx}
        tabIndex={0}
        {...stateProps?.listeners}
        {...other}
      >
        {renderImg}

        <Stack spacing={2} sx={{ px: 2, py: 2.5, position: 'relative' }}>

          <Typography variant="subtitle2">{task.name}</Typography>

        </Stack>
      </StyledItem>
    </StyledItemWrap>
  );
});

export default memo(ItemBase);
