<template>
    <DefaultField :field="field" :errors="errors" :show-help-text="showHelpText" :full-width-content="true" @keydown.stop>
        <template #field>
            <div :id="`editor-js-${field.attribute}`" ref="input" class="editor-js" />
            <SelectPlaceholdersModal
                v-if="placeholderPopup"
                label="Select Placeholder"
                :selected-resource="currentField.documentResource"
                :global-placeholders="globalPlaceholders"
                @insert-placeholder="insertPlaceholder"
                @cancel="closePlaceholderPopup"
            ></SelectPlaceholdersModal>
        </template>
    </DefaultField>
</template>

<script>
import { DependentFormField, HandlesValidationErrors } from 'laravel-nova';
import initializesEditorJs from './../mixins/initializesEditorJs';
import HasPlaceholders from './../mixins/HasPlaceholders';

export default {
    mixins: [DependentFormField, HandlesValidationErrors, initializesEditorJs, HasPlaceholders],

    props: ['resourceName', 'resourceId', 'field'],

    data() {
        return {
            placeholderPopup: false,
            editableElement: null,
            editableElementCaretPosition: null,
            globalPlaceholders: {},
        };
    },

    methods: {
        /*
         * Set the initial, internal value for the field.
         */
        setInitialValue() {
            this.value = this.currentField.value;
            this.initializeEditorJs();
        },

        /**
         * Fill the given FormData object with the field's internal value.
         */
        fill(formData) {
            const value = typeof this.value === 'string' ? this.value : JSON.stringify(this.value);
            formData.append(this.currentField.attribute, value || '');
        },
    },
};
</script>
