export default {
    methods: {
        fetchFieldPlaceholders(resource) {
            this.loading = true;
            return Nova.request({
                method: 'post',
                url: route('resource.placeholders.index', { resource: resource }, false),
                data: {},
            })
                .then((response) => {
                    this.fieldPlaceholders = response.data.fields;
                })
                .catch(() => {
                    Nova.error(this.__('There was a problem fetching field placeholders.'));
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        fetchGlobalPlaceholders() {
            this.loading = true;
            return Nova.request({
                method: 'post',
                url: route('resource.placeholders.index', { resource: 'resource' }, false),
                data: {},
            })
                .then((response) => {
                    this.globalPlaceholders = response.data;
                })
                .catch(() => {
                    Nova.error(this.__('There was a problem fetching global placeholders.'));
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        openPlaceholderPopup(editableElement) {
            this.placeholderPopup = true;
            this.editableElement = editableElement;
            this.editableElementCaretPosition = this.getCaretPosition(editableElement);
        },
        closePlaceholderPopup() {
            this.placeholderPopup = false;
            this.editableElement = null;
            this.editableElementCaretPosition = null;
        },

        getCaretPosition(element) {
            var selection = window.getSelection();
            if (!selection.rangeCount) return -1;
            var range = selection.getRangeAt(0);
            var workingRange = range.cloneRange();
            workingRange.selectNodeContents(element);
            workingRange.setEnd(range.startContainer, range.startOffset);
            return workingRange.toString().length;
        },

        insertPlaceholder(placeholder) {
            const editableElementText = this.editableElement.textContent;

            const before = editableElementText.slice(0, this.editableElementCaretPosition);
            const after = editableElementText.slice(this.editableElementCaretPosition);
            this.editableElement.textContent = before + placeholder + after;
            this.closePlaceholderPopup();
        },
    },
};
