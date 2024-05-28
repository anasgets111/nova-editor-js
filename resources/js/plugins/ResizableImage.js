import SimpleImage from '@editorjs/image';

import {
    IconAddBorder,
    IconStretch,
    IconAddBackground,
    IconPicture,
    IconAlignLeft,
    IconAlignCenter,
    IconAlignRight,
    IconFile
} from '@codexteam/icons';

export default class ResizableImage extends SimpleImage {
    constructor({ data, config, api, readOnly }) {
        super({ data, config, api, readOnly });
        this.config.uniqueId = config.uniqueId;
    }

    static get toolbox() {
        return {
            title: 'Resizable Image',
            icon: IconFile,
        };
    }

    get additionalTunes() {
        return [
            {
                name: 'alightLeft',
                icon: IconAlignLeft,
                title: 'Align Left',
                toggle: true,
                action: (name, blockElement) => {
                    blockElement.className = '.cdx-block image-tool image-tool--filled flex flex justify-start';
                },
            },
            {
                name: 'alightCenter',
                icon: IconAlignCenter,
                title: 'Align Center',
                toggle: false,
                action: (name, blockElement) => {
                    blockElement.className = '.cdx-block image-tool image-tool--filled flex flex justify-center';

                },
            },
            {
                name: 'alightRight',
                icon: IconAlignRight,
                title: 'Align Right',
                toggle: false,
                action: (name, blockElement) => {
                    blockElement.className = '.cdx-block image-tool image-tool--filled flex flex justify-end';

                },
            },
        ];
    }

    render() {
        const nodes = super.render();
        this.blockElement = nodes;
        const caption = nodes.querySelector('.image-tool__caption');
        caption.remove();
        const imageParent = nodes.querySelector('.image-tool__image');
        imageParent.style.resize = 'horizontal';
        imageParent.style.overflow = 'hidden';
        imageParent.style['max-width'] = '100%';
        imageParent.style['max-height'] = '100%';
        
        console.log(nodes);
        console.log("render");

        return nodes;
    }

    renderSettings() {
        const tunes = super.renderSettings();
        let _this = this;
        this.additionalTunes.forEach(function (tune) {
            const tuneElement = document.createElement('button');
            tuneElement.title = tune.title;
            tuneElement.className = 'cdx-settings-button image-tool__tune';
            tuneElement.innerHTML = tune.icon;
            tuneElement['data-tune'] = tune.name;

            tuneElement.addEventListener('click', (event) => {
                event.preventDefault();
                // Handle toggle or custom action
                if (typeof tune.action === 'function') {
                    tune.action(tune.name, _this.blockElement);
                    _this.tuneToggled(tune.name);

                } else {
                    _this.tuneToggled(tune.name);
                }

            });

            tunes.appendChild(tuneElement);
        });


        return tunes;
    }
}
