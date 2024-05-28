<?php

declare(strict_types=1);

namespace Advoor\NovaEditorJs;

use Stringable;
use App\Tools\TemporaryUrl;
use Illuminate\Support\Arr;
use Illuminate\Support\Fluent;
use Illuminate\Contracts\Support\Htmlable;

class NovaEditorJsData extends Fluent implements Htmlable, Stringable
{
    /**
     * Create a new fluent instance.
     *
     * @param  iterable<TKey, TValue>  $attributes
     * @return void
     */
    public function __construct($attributes = [])
    {
        if (is_string($attributes)) {
            $attributes = json_decode($attributes);
        }

        if (!is_iterable($attributes)) {
            $attributes = Arr::wrap($attributes);
        }

        foreach ($attributes as $key => $value) {
            $this->attributes[$key] = $value;
        }

        $this->attributes = static::generateTemporaryUrls($this->attributes);
    }

    /**
     * @return \Illuminate\Support\HtmlString
     */
    public function toHtml()
    {
        return NovaEditorJs::generateHtmlOutput($this);
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->toHtml();
    }

    public static function generateTemporaryUrls($data)
    {
        $blocks = collect(data_get($data, 'blocks'))->map(function ($block) {
            if (in_array(data_get($block, 'type'), ['resizableImage', 'image'])) {
                $imageUrl = data_get($block, 'data.file.url');
                $imageUrl = TemporaryUrl::make($imageUrl)->generate();
                data_set($block, 'data.file.url', $imageUrl);
            }
            return $block;
        })->all();

        data_set($data, 'blocks', $blocks);
        return $data;
    }
}
