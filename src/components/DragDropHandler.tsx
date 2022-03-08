import { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';

import { loadShowFromLocalFile } from '~/features/show/actions';

const extractFileFromEvent = (event: DragEvent) => {
  if (!event.dataTransfer) {
    return undefined;
  }

  const { files, items } = event.dataTransfer;
  let file;

  if (items && items.length === 1 && items[0].kind === 'file') {
    file = items[0].getAsFile();
  } else if (files && files.length === 1) {
    file = files[0];
  }

  if (!file) {
    return undefined;
  }

  // The requirement of the file.path property prevents this from working in
  // the browser, but that's exactly what we want
  return file.name.endsWith('.skyc') && file.path ? file.path : undefined;
};

const onFileDragging = (event: DragEvent) => {
  // Prevent the default behaviour of the browser
  event.preventDefault();
};

interface DragDropHandlerProps {
  onFileDropped: (filename: string) => void;
}

const DragDropHandler = ({ onFileDropped }: DragDropHandlerProps) => {
  const handleDrop = useCallback(
    (event) => {
      const filename = extractFileFromEvent(event);
      if (filename) {
        onFileDropped(filename);
      }
    },
    [onFileDropped]
  );

  useEffect(() => {
    const target = document;

    target.addEventListener('dragover', onFileDragging);
    target.addEventListener('drop', handleDrop);
    return () => {
      target.removeEventListener('dragover', onFileDragging);
      target.removeEventListener('drop', handleDrop);
    };
  }, [handleDrop]);
  return null;
};

export default connect(
  // mapStateToProps
  null,
  // mapDispatchToProps
  {
    onFileDropped: loadShowFromLocalFile,
  }
)(DragDropHandler);
