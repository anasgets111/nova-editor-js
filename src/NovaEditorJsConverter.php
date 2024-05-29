<?php

declare(strict_types=1);

namespace Advoor\NovaEditorJs;

use Closure;
use stdClass;
use JsonException;
use EditorJS\EditorJS;
use Illuminate\Support\Str;
use EditorJS\EditorJSException;
use Illuminate\Support\HtmlString;

class NovaEditorJsConverter
{
    /**
     * List of callbacks that can render blocks
     *
     * @var array<Closure>
     */
    protected array $renderCallbacks = [];

    public function __construct()
    {
        $this->registerDefaultCallbacks();
    }

    /**
     * Add a custom render callback for the given block.
     *
     * @param  string  $block  Name of the block, as defined in the JSON
     * @param  callable  $callback  Closure that returns a string (or a Stringable)
     */
    public function addRender(string $block, callable $callback): void
    {
        $this->renderCallbacks[$block] = $callback;
    }

    /**
     * Renders the given EditorJS data to safe HTML.
     *
     * @return \Illuminate\Support\HtmlString Safe, directly returnable string.
     */
    public function generateHtmlOutput(mixed $data): HtmlString
    {
        $data = NovaEditorJsData::generateTemporaryUrls($data);


        if (empty($data) || $data == new stdClass()) {
            return new HtmlString('');
        }

        // Clean non-string data
        if (!is_string($data)) {
            try {
                $data = json_encode($data, JSON_THROW_ON_ERROR);
            } catch (JsonException $exception) {
                // noop
            }
        }

        $config = config('nova-editor-js.validationSettings');

        try {
            // Initialize Editor backend and validate structure
            $editor = new EditorJS($data, json_encode($config));

            // Get sanitized blocks (according to the rules from configuration)
            $blocks = $editor->getBlocks();

            $blocks = $this->cleanImageUrls($blocks);

            $htmlOutput = '';

            foreach ($blocks as $block) {
                if (array_key_exists($block['type'], $this->renderCallbacks)) {
                    $htmlOutput .= $this->renderCallbacks[$block['type']]($block);
                }
            }

            return new HtmlString(
                view('nova-editor-js::content', ['content' => $htmlOutput])->render()
            );
        } catch (EditorJSException $exception) {
            // process exception
            return new HtmlString(
                "Something went wrong: {$exception->getMessage()}"
            );
        }
    }

    //Urls after passing through sanitization, include characters like "amp;" which can fail authentication
    //of signed urls

    private function cleanImageUrls($blocks)
    {
        return collect($blocks)->map(function ($block) {
            if (in_array(data_get($block, 'type'), ['resizableImage', 'image'])) {
                $imageUrl = data_get($block, 'data.file.url');
                $cleanImageUrl = Str::replace("amp;", "", $imageUrl);
                data_set($block, 'data.file.url', $cleanImageUrl);
            }
            return $block;
        })->all();
    }

    /**
     * Registers all default render helpers
     */
    protected function registerDefaultCallbacks(): void
    {
        $this->addRender(
            'header',
            fn ($block) => view('nova-editor-js::heading', $block['data'])->render()
        );

        $this->addRender(
            'paragraph',
            fn ($block) => view('nova-editor-js::paragraph', $block['data'])->render()
        );

        $this->addRender(
            'list',
            fn ($block) => view('nova-editor-js::list', $block['data'])->render()
        );

        $this->addRender(
            'image',
            fn ($block) => view('nova-editor-js::image', array_merge($block['data'], [
                'classes' => $this->calculateImageClasses($block['data']),
            ]))->render()
        );

        $this->addRender(
            'resizableImage',
            fn ($block) => view('nova-editor-js::resizable-image', array_merge($block['data'], [
                'classes' => $this->calculateImageClasses($block['data']),
                'imageBlockClasses' => $this->calculateImageBlockClasses($block['data']),

            ]))->render()
        );

        $this->addRender(
            'code',
            fn ($block) => view('nova-editor-js::code', $block['data'])->render()
        );

        $this->addRender(
            'linkTool',
            fn ($block) => view('nova-editor-js::link', $block['data'])->render()
        );

        $this->addRender(
            'checklist',
            fn ($block) => view('nova-editor-js::checklist', $block['data'])->render()
        );

        $this->addRender(
            'delimiter',
            fn ($block) => view('nova-editor-js::delimiter', $block['data'])->render()
        );

        $this->addRender(
            'table',
            fn ($block) => view('nova-editor-js::table', $block['data'])->render()
        );

        $this->addRender(
            'raw',
            fn ($block) => view('nova-editor-js::raw', $block['data'])->render()
        );

        $this->addRender(
            'embed',
            fn ($block) => view('nova-editor-js::embed', $block['data'])->render()
        );
    }

    /**
     * @return string
     */
    protected function calculateImageClasses($blockData)
    {
        $classes = [];
        foreach ($blockData as $key => $data) {
            if (is_bool($data) && $data === true) {
                $classes[] = $key;
            }
        }

        return implode(' ', $classes);
    }

    protected function calculateImageBlockClasses($blockData)
    {
        if (data_get($blockData, 'align') == 'center') {
            return "flex justify-center";
        }

        if (data_get($blockData, 'align') == 'right') {
            return "flex justify-end";
        }

        return "flex justify-start";
    }
}
