import { useEffect, useRef, RefObject } from 'react';

export type MouseEvents = 'click' | 'mousedown' | 'mouseup';
export type TouchEvents = 'touchstart' | 'touchend';

interface Props {
  onClickAway: (event: MouseEvent | TouchEvent) => void;
}

interface RefOption<RefElement extends HTMLElement> {
  ref?: RefObject<RefElement>;
}

interface Options {
  mouseEvent?: MouseEvents;
  touchEvent?: TouchEvents;
}

export default function useOutsideClickListener<
  RefElement extends HTMLElement = HTMLDivElement
>(
  onClickAway: (event: MouseEvent | TouchEvent) => void,
  {
    mouseEvent = 'click',
    touchEvent = 'touchend',
    ref,
  }: Options & RefOption<RefElement> = {},
): RefObject<RefElement> {
  const ownRef = useRef<RefElement>(null);

  return useOutsideClickListenerInner(ref || ownRef, onClickAway, {
    mouseEvent,
    touchEvent,
  });
}

function useOutsideClickListenerInner<
  RefElement extends HTMLElement = HTMLDivElement
>(
  node: RefObject<RefElement>,
  onClickAway: (event: MouseEvent | TouchEvent) => void,
  { mouseEvent = 'click', touchEvent = 'touchend' }: Options = {},
): RefObject<RefElement> {
  useEffect(() => {
    const handleEvents = (event: MouseEvent | TouchEvent): void => {
      if (node.current && node.current.contains(event.target as Node)) {
        return;
      }

      onClickAway(event);
    };

    document.addEventListener(mouseEvent, handleEvents);
    document.addEventListener(touchEvent, handleEvents);

    return () => {
      document.removeEventListener(mouseEvent, handleEvents);
      document.removeEventListener(touchEvent, handleEvents);
    };
  }, [onClickAway, mouseEvent, touchEvent, node]);

  return node;
}
