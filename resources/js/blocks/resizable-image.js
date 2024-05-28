import ResizableImage from './../plugins/ResizableImage.js';

NovaEditorJS.booting((editorConfig, fieldConfig) => {
    if (fieldConfig.toolSettings.image.activated === true) {
        editorConfig.tools.resizableImage = {
            class: ResizableImage,
            inlineToolbar: true,
            config: {
                endpoints: {
                    byFile: fieldConfig.uploadImageByFileEndpoint,
                    byUrl: fieldConfig.uploadImageByUrlEndpoint,
                },
                additionalRequestHeaders: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            },
        };
    }
});
