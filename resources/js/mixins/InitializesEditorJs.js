import { IconPlus } from '@codexteam/icons';

export default {
    methods: {
        initializeEditorJs() {
            const _this = this;
            const field = this.field;

            const currentContent = typeof field.value === 'object' ? field.value : JSON.parse(field.value);
            const editor = NovaEditorJS.getInstance(
                {
                    /**
                     * Wrapper of Editor
                     */
                    holder: `editor-js-${field.attribute}`,

                    /**
                     * This Tool will be used as default
                     */
                    defaultBlock: field.editorSettings.initialBlock,

                    /**
                     * Default placeholder
                     */
                    placeholder: field.editorSettings.placeholder,

                    /**
                     * Enable autofocus
                     */
                    autofocus: field.editorSettings.autofocus,

                    /**
                     * Internalization config
                     */
                    i18n: {
                        /**
                         * Text direction. If not set, uses ltr
                         */
                        direction: field.editorSettings.rtl ?? false ? 'rtl' : 'ltr',
                    },

                    /**
                     * Initial Editor data
                     */
                    data: currentContent,

                    /**
                     * Min height of editor
                     */
                    minHeight: 35,

                    onReady() {
                        _this.attachPlaceholderTool();
                    },
                    onChange() {
                        editor.save().then((savedData) => {
                            _this.handleChange(savedData);
                        });
                    },
                },
                field
            );
        },

        /**
         * Update the field's internal value.
         */
        handleChange(value) {
            this.value = JSON.stringify(value);
        },

        attachPlaceholderTool() {
            const _this = this;
            const editableElements = document.querySelectorAll('[contenteditable="true"]');
            editableElements.forEach(function (editableElement) {
                const container = document.createElement('div');
                container.classList.add('flex', 'items-center', 'gap-2');
                const plusElement = document.createElement('div');
                plusElement.innerHTML = IconPlus;
                plusElement.style.display = 'none';
                plusElement.className = 'border-2 rounded-2xl text-primary-500 hover:bg-primary-400 hover:text-white font-bold';

                editableElement.parentElement.appendChild(container);
                container.appendChild(editableElement);
                container.appendChild(plusElement);

                plusElement.classList.add('cursor-pointer');

                editableElement.addEventListener('focus', function () {
                    plusElement.style.display = 'block';
                });

                editableElement.addEventListener('blur', function () {
                    plusElement.style.display = 'none';
                });

                plusElement.addEventListener('mousedown', function (event) {
                    event.preventDefault();
                    _this.openPlaceholderPopup(editableElement);
                });
            });
        },
    },
};
