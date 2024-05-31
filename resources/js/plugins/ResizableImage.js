import SimpleImage from '@editorjs/image';
import './index.css';

import {
    IconAddBorder,
    IconStretch,
    IconAddBackground,
    IconPicture,
    IconAlignLeft,
    IconAlignCenter,
    IconAlignRight,
    IconFile,
} from '@codexteam/icons';

export default class ResizableImage extends SimpleImage {
    constructor({ data, config, api, readOnly }) {
        super({ data, config, api, readOnly });

        this.additionalData = {};
        this.additionalData.width = data.width;
        this.additionalData.height = data.height;
        this.additionalData.align = data.align;
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
                    this._alignLeft(blockElement);
                },
            },
            {
                name: 'alightCenter',
                icon: IconAlignCenter,
                title: 'Align Center',
                toggle: false,
                action: (name, blockElement) => {
                    this._alignCenter(blockElement);
                },
            },
            {
                name: 'alightRight',
                icon: IconAlignRight,
                title: 'Align Right',
                toggle: false,
                action: (name, blockElement) => {
                    this._alignRight(blockElement);
                },
            },
        ];
    }

    render() {
        const nodes = super.render();
        this.blockElement = nodes;

        this._removeCaption();
        this._alignImage(nodes);
        this._prepareImageForResize();

        return nodes;
    }

    _removeCaption() {
        const caption = this.blockElement.querySelector('.image-tool__caption');
        caption.remove();
    }

    _prepareImageForResize() {
        const imageParent = this.blockElement.querySelector('.image-tool__image');

        imageParent.style.resize = 'both';
        imageParent.style['max-width'] = '100%';
        imageParent.style['max-height'] = '100%';

        if (this.additionalData.width) {
            imageParent.style.width = this.additionalData.width + 'px';
        }

        if (this.additionalData.height) {
            imageParent.style.height = this.additionalData.height + 'px';
        }

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                this._data.width = Math.round(width);
                this._data.height = Math.round(height);
            }
        });

        resizeObserver.observe(imageParent);
    }

    _alignImage(blockElement) {
        if (this.additionalData.align == 'center') {
            return this._alignCenter(blockElement);
        }

        if (this.additionalData.align == 'right') {
            return this._alignRight(blockElement);
        }

        return this._alignLeft(blockElement);
    }

    _alignLeft(blockElement) {
        blockElement.classList.remove('flex', 'justify-center', 'justify-end');
        blockElement.classList.add('flex', 'justify-start');
        this._data.align = 'left';
    }

    _alignCenter(blockElement) {
        blockElement.classList.remove('flex', 'justify-start', 'justify-end');
        blockElement.classList.add('flex', 'justify-center');
        this._data.align = 'center';
    }

    _alignRight(blockElement) {
        blockElement.classList.remove('flex', 'justify-start', 'justify-center');
        blockElement.classList.add('flex', 'justify-end');
        this._data.align = 'right';
    }

    renderSettings() {
        const tunes = document.createElement('div');
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
                    // _this.tuneToggled(tune.name);
                } else {
                    _this.tuneToggled(tune.name);
                }
            });

            tunes.appendChild(tuneElement);
        });

        return tunes;
    }
}
