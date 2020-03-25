/* eslint-disable */
// Example code from react-popper-tooltip

import classNames from 'classnames/bind';
import React from 'react';
import TooltipTrigger from 'react-popper-tooltip';

import styles from './Tooltip.css';

const cx = classNames.bind(styles);

const getOffset = (placement: string) => {
  switch (placement) {
    case 'top':
      return '0, 4';
    case 'right':
      return '4, 0';
    case 'bottom':
      return '0, -4';
    case 'left':
      return '-4, 0';
    default:
      return 0;
  }
};

const Tooltip = ({ children, tooltip, hideArrow, ...props }) => (
  <TooltipTrigger
    {...props}
    modifiers={{
      offset: {
        offset: getOffset(props.placement)
      }
    }}
    tooltip={({
      arrowRef,
      tooltipRef,
      getArrowProps,
      getTooltipProps,
      placement
    }) => (
      <div
        {...getTooltipProps({
          ref: tooltipRef,
          className: cx('tooltip-container')
        })}
      >
        {!hideArrow && (
          <div
            {...getArrowProps({
              ref: arrowRef,
              className: cx('tooltip-arrow'),
              'data-placement': placement
            })}
          />
        )}
        {tooltip}
      </div>
    )}
  >
    {({ getTriggerProps, triggerRef }) =>
      React.cloneElement(
        children,
        getTriggerProps({
          ref: triggerRef
        })
      )}
  </TooltipTrigger>
);

export default Tooltip;
