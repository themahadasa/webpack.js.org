(window.webpackJsonp=window.webpackJsonp||[]).push([[69],{359:function(e,n,s){"use strict";s.r(n),n.default='<blockquote class="tip">\n<p>This guide extends the examples provided in <a href="/guides/getting-started">Getting Started</a> and <a href="/guides/output-management">Output Management</a>. Please make sure you are at least familiar with the examples provided in them.</p>\n</blockquote>\n<p>Code splitting is one of the most compelling features of webpack. This feature allows you to split your code into various bundles which can then be loaded on demand or in parallel. It can be used to achieve smaller bundles and control resource load prioritization which, if used correctly, can have a major impact on load time.</p>\n<p>There are three general approaches to code splitting available:</p>\n<ul>\n<li>Entry Points: Manually split code using <a href="/configuration/entry-context"><code>entry</code></a> configuration.</li>\n<li>Prevent Duplication: Use the <a href="/plugins/split-chunks-plugin/"><code>SplitChunksPlugin</code></a> to dedupe and split chunks.</li>\n<li>Dynamic Imports: Split code via inline function calls within modules.</li>\n</ul>\n<h2 id="entry-points">Entry Points<a href="#entry-points" aria-hidden="true"><span class="icon icon-link"></span></a></h2>\n<p>This is by far the easiest and most intuitive way to split code. However, it is more manual and has some pitfalls we will go over. Let\'s take a look at how we might split another module from the main bundle:</p>\n<p><strong>project</strong></p>\n<pre><code class="hljs language-diff">webpack-demo\n|- package.json\n|- webpack.config.js\n|- /dist\n|- /src\n  |- index.js\n<span class="token inserted">+ |- another-module.js</span>\n|- /node_modules</code></pre>\n<p><strong>another-module.js</strong></p>\n<pre><code class="hljs language-js"><span class="token keyword">import</span> _ <span class="token keyword">from</span> <span class="token string">\'lodash\'</span><span class="token punctuation">;</span>\n\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>\n  _<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">\'Another\'</span><span class="token punctuation">,</span> <span class="token string">\'module\'</span><span class="token punctuation">,</span> <span class="token string">\'loaded!\'</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token string">\' \'</span><span class="token punctuation">)</span>\n<span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>\n<p><strong>webpack.config.js</strong></p>\n<pre><code class="hljs language-diff">const path = require(\'path\');\n\nmodule.exports = {\n  mode: \'development\',\n  entry: {\n    index: \'./src/index.js\',\n<span class="token inserted">+   another: \'./src/another-module.js\',</span>\n  },\n  output: {\n    filename: \'[name].bundle.js\',\n    path: path.resolve(__dirname, \'dist\'),\n  },\n};</code></pre>\n<p>This will yield the following build result:</p>\n<pre><code class="hljs language-bash"><span class="token punctuation">..</span>.\n            Asset     Size   Chunks             Chunk Names\nanother.bundle.js  550 KiB  another  <span class="token punctuation">[</span>emitted<span class="token punctuation">]</span>  another\n  index.bundle.js  550 KiB    index  <span class="token punctuation">[</span>emitted<span class="token punctuation">]</span>  index\nEntrypoint index <span class="token operator">=</span> index.bundle.js\nEntrypoint another <span class="token operator">=</span> another.bundle.js\n<span class="token punctuation">..</span>.</code></pre>\n<p>As mentioned there are some pitfalls to this approach:</p>\n<ul>\n<li>If there are any duplicated modules between entry chunks they will be included in both bundles.</li>\n<li>It isn\'t as flexible and can\'t be used to dynamically split code with the core application logic.</li>\n</ul>\n<p>The first of these two points is definitely an issue for our example, as <code>lodash</code> is also imported within <code>./src/index.js</code> and will thus be duplicated in both bundles. Let\'s remove this duplication by using the <a href="/plugins/split-chunks-plugin/"><code>SplitChunksPlugin</code></a>.</p>\n<h2 id="prevent-duplication">Prevent Duplication<a href="#prevent-duplication" aria-hidden="true"><span class="icon icon-link"></span></a></h2>\n<h3 id="entry-dependencies">Entry dependencies<a href="#entry-dependencies" aria-hidden="true"><span class="icon icon-link"></span></a></h3>\n<p>The <a href="/configuration/entry-context/#dependencies"><code>dependOn</code> option</a> allows to share the modules between the chunks</p>\n<pre><code class="hljs language-diff">  const path = require(\'path\');\n\n  module.exports = {\n    mode: \'development\',\n    entry: {\n<span class="token deleted">-     index: \'./src/index.js\',</span>\n<span class="token deleted">-     another: \'./src/another-module.js\',</span>\n<span class="token inserted">+     index: { import: \'./src/index.js\', dependOn: \'shared\' },</span>\n<span class="token inserted">+     another: { import: \'./src/another-module.js\', dependOn: \'shared\' },</span>\n<span class="token inserted">+     shared: \'lodash\',</span>\n    },\n    output: {\n      filename: \'[name].bundle.js\',\n      path: path.resolve(__dirname, \'dist\'),\n    },\n  };</code></pre>\n<h3 id="splitchunksplugin"><code>SplitChunksPlugin</code><a href="#splitchunksplugin" aria-hidden="true"><span class="icon icon-link"></span></a></h3>\n<p>The <a href="/plugins/split-chunks-plugin/"><code>SplitChunksPlugin</code></a> allows us to extract common dependencies into an existing entry chunk or an entirely new chunk. Let\'s use this to de-duplicate the <code>lodash</code> dependency from the previous example:</p>\n<blockquote class="warning">\n<p>The <code>CommonsChunkPlugin</code> has been removed in webpack v4 legato. To learn how chunks are treated in the latest version, check out the <a href="/plugins/split-chunks-plugin/"><code>SplitChunksPlugin</code></a>.</p>\n</blockquote>\n<p><strong>webpack.config.js</strong></p>\n<pre><code class="hljs language-diff">  const path = require(\'path\');\n\n  module.exports = {\n    mode: \'development\',\n    entry: {\n      index: \'./src/index.js\',\n      another: \'./src/another-module.js\',\n    },\n    output: {\n      filename: \'[name].bundle.js\',\n      path: path.resolve(__dirname, \'dist\'),\n    },\n<span class="token inserted">+   optimization: {</span>\n<span class="token inserted">+     splitChunks: {</span>\n<span class="token inserted">+       chunks: \'all\',</span>\n<span class="token inserted">+     },</span>\n<span class="token inserted">+   },</span>\n  };</code></pre>\n<p>With the <a href="/plugins/split-chunks-plugin/#optimizationsplitchunks"><code>optimization.splitChunks</code></a> configuration option in place, we should now see the duplicate dependency removed from our <code>index.bundle.js</code> and <code>another.bundle.js</code>. The plugin should notice that we\'ve separated <code>lodash</code> out to a separate chunk and remove the dead weight from our main bundle. Let\'s do an <code>npm run build</code> to see if it worked:</p>\n<pre><code class="hljs language-bash"><span class="token punctuation">..</span>.\n                          Asset      Size                 Chunks             Chunk Names\n              another.bundle.js  5.95 KiB                another  <span class="token punctuation">[</span>emitted<span class="token punctuation">]</span>  another\n                index.bundle.js  5.89 KiB                  index  <span class="token punctuation">[</span>emitted<span class="token punctuation">]</span>  index\nvendors~another~index.bundle.js   547 KiB  vendors~another~index  <span class="token punctuation">[</span>emitted<span class="token punctuation">]</span>  vendors~another~index\nEntrypoint index <span class="token operator">=</span> vendors~another~index.bundle.js index.bundle.js\nEntrypoint another <span class="token operator">=</span> vendors~another~index.bundle.js another.bundle.js\n<span class="token punctuation">..</span>.</code></pre>\n<p>Here are some other useful plugins and loaders provided by the community for splitting code:</p>\n<ul>\n<li><a href="/plugins/mini-css-extract-plugin"><code>mini-css-extract-plugin</code></a>: Useful for splitting CSS out from the main application.</li>\n<li><a href="/loaders/bundle-loader"><code>bundle-loader</code></a>: Used to split code and lazy load the resulting bundles.</li>\n<li><a href="https://github.com/gaearon/promise-loader"><code>promise-loader</code></a>: Similar to the <code>bundle-loader</code> but uses promises.</li>\n</ul>\n<h2 id="dynamic-imports">Dynamic Imports<a href="#dynamic-imports" aria-hidden="true"><span class="icon icon-link"></span></a></h2>\n<p>Two similar techniques are supported by webpack when it comes to dynamic code splitting. The first and recommended approach is to use the <a href="/api/module-methods/#import-1"><code>import()</code> syntax</a> that conforms to the <a href="https://github.com/tc39/proposal-dynamic-import">ECMAScript proposal</a> for dynamic imports. The legacy, webpack-specific approach is to use <a href="/api/module-methods/#requireensure"><code>require.ensure</code></a>. Let\'s try using the first of these two approaches...</p>\n<blockquote class="warning">\n<p><code>import()</code> calls use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">promises</a> internally. If you use <code>import()</code> with older browsers, remember to shim <code>Promise</code> using a polyfill such as <a href="https://github.com/stefanpenner/es6-promise">es6-promise</a> or <a href="https://github.com/taylorhakes/promise-polyfill">promise-polyfill</a>.</p>\n</blockquote>\n<p>Before we start, let\'s remove the extra <a href="/concepts/entry-points/"><code>entry</code></a> and <a href="/plugins/split-chunks-plugin"><code>optimization.splitChunks</code></a> from our config as they won\'t be needed for this next demonstration:</p>\n<p><strong>webpack.config.js</strong></p>\n<pre><code class="hljs language-diff">  const path = require(\'path\');\n\n  module.exports = {\n    mode: \'development\',\n    entry: {\n      index: \'./src/index.js\',\n<span class="token deleted">-     another: \'./src/another-module.js\',</span>\n    },\n    output: {\n      filename: \'[name].bundle.js\',\n<span class="token inserted">+     chunkFilename: \'[name].bundle.js\',</span>\n      publicPath: \'dist/\',\n      path: path.resolve(__dirname, \'dist\'),\n    },\n<span class="token deleted">-   optimization: {</span>\n<span class="token deleted">-     splitChunks: {</span>\n<span class="token deleted">-       chunks: \'all\',</span>\n<span class="token deleted">-     },</span>\n<span class="token deleted">-   },</span>\n  };</code></pre>\n<p>Note the use of <code>chunkFilename</code>, which determines the name of non-entry chunk files. For more information on <code>chunkFilename</code>, see <a href="/configuration/output/#outputchunkfilename">output documentation</a>. We\'ll also update our project to remove the now unused files:</p>\n<p><strong>project</strong></p>\n<pre><code class="hljs language-diff">webpack-demo\n|- package.json\n|- webpack.config.js\n|- /dist\n|- /src\n  |- index.js\n<span class="token deleted">- |- another-module.js</span>\n|- /node_modules</code></pre>\n<p>Now, instead of statically importing <code>lodash</code>, we\'ll use dynamic importing to separate a chunk:</p>\n<p><strong>src/index.js</strong></p>\n<pre><code class="hljs language-diff"><span class="token deleted">- import _ from \'lodash\';</span>\n<span class="token deleted">-</span>\n<span class="token deleted">- function component() {</span>\n<span class="token inserted">+ function getComponent() {</span>\n<span class="token deleted">-   const element = document.createElement(\'div\');</span>\n<span class="token deleted">-</span>\n<span class="token deleted">-   // Lodash, now imported by this script</span>\n<span class="token deleted">-   element.innerHTML = _.join([\'Hello\', \'webpack\'], \' \');</span>\n<span class="token inserted">+   return import(/* webpackChunkName: "lodash" */ \'lodash\').then(({ default: _ }) => {</span>\n<span class="token inserted">+     const element = document.createElement(\'div\');</span>\n<span class="token inserted">+</span>\n<span class="token inserted">+     element.innerHTML = _.join([\'Hello\', \'webpack\'], \' \');</span>\n<span class="token inserted">+</span>\n<span class="token inserted">+     return element;</span>\n<span class="token inserted">+</span>\n<span class="token inserted">+   }).catch(error => \'An error occurred while loading the component\');</span>\n  }\n\n<span class="token deleted">- document.body.appendChild(component());</span>\n<span class="token inserted">+ getComponent().then(component => {</span>\n<span class="token inserted">+   document.body.appendChild(component);</span>\n<span class="token inserted">+ })</span></code></pre>\n<p>The reason we need <code>default</code> is that since webpack 4, when importing a CommonJS module, the import will no longer resolve to the value of <code>module.exports</code>, it will instead create an artificial namespace object for the CommonJS module. For more information on the reason behind this, read <a href="https://medium.com/webpack/webpack-4-import-and-commonjs-d619d626b655">webpack 4: import() and CommonJs</a></p>\n<p>Note the use of <code>webpackChunkName</code> in the comment. This will cause our separate bundle to be named <code>lodash.bundle.js</code> instead of just <code>[id].bundle.js</code>. For more information on <code>webpackChunkName</code> and the other available options, see the <a href="/api/module-methods/#import-1"><code>import()</code> documentation</a>. Let\'s run webpack to see <code>lodash</code> separated out to a separate bundle:</p>\n<pre><code class="hljs language-bash"><span class="token punctuation">..</span>.\n                   Asset      Size          Chunks             Chunk Names\n         index.bundle.js  7.88 KiB           index  <span class="token punctuation">[</span>emitted<span class="token punctuation">]</span>  index\nvendors~lodash.bundle.js   547 KiB  vendors~lodash  <span class="token punctuation">[</span>emitted<span class="token punctuation">]</span>  vendors~lodash\nEntrypoint index <span class="token operator">=</span> index.bundle.js\n<span class="token punctuation">..</span>.</code></pre>\n<p>As <code>import()</code> returns a promise, it can be used with <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function"><code>async</code> functions</a>. However, this requires using a pre-processor like Babel and the <a href="https://babeljs.io/docs/plugins/syntax-dynamic-import/#installation">Syntax Dynamic Import Babel Plugin</a>. Here\'s how it would simplify the code:</p>\n<p><strong>src/index.js</strong></p>\n<pre><code class="hljs language-diff"><span class="token deleted">- function getComponent() {</span>\n<span class="token inserted">+ async function getComponent() {</span>\n<span class="token deleted">-   return import(/* webpackChunkName: "lodash" */ \'lodash\').then(({ default: _ }) => {</span>\n<span class="token deleted">-     const element = document.createElement(\'div\');</span>\n<span class="token deleted">-</span>\n<span class="token deleted">-     element.innerHTML = _.join([\'Hello\', \'webpack\'], \' \');</span>\n<span class="token deleted">-</span>\n<span class="token deleted">-     return element;</span>\n<span class="token deleted">-</span>\n<span class="token deleted">-   }).catch(error => \'An error occurred while loading the component\');</span>\n<span class="token inserted">+   const element = document.createElement(\'div\');</span>\n<span class="token inserted">+   const { default: _ } = await import(/* webpackChunkName: "lodash" */ \'lodash\');</span>\n<span class="token inserted">+</span>\n<span class="token inserted">+   element.innerHTML = _.join([\'Hello\', \'webpack\'], \' \');</span>\n<span class="token inserted">+</span>\n<span class="token inserted">+   return element;</span>\n  }\n\n  getComponent().then(component => {\n    document.body.appendChild(component);\n  });</code></pre>\n<blockquote class="tip">\n<p>It is possible to provide a <a href="/api/module-methods/#dynamic-expressions-in-import">dynamic expression</a> to <code>import()</code> when you might need to import specific module based on a computed variable later.</p>\n</blockquote>\n<h2 id="prefetchingpreloading-modules">Prefetching/Preloading modules<a href="#prefetchingpreloading-modules" aria-hidden="true"><span class="icon icon-link"></span></a></h2>\n<p>webpack 4.6.0+ adds support for prefetching and preloading.</p>\n<p>Using these inline directives while declaring your imports allows webpack to output “Resource Hint” which tells the browser that for:</p>\n<ul>\n<li>prefetch: resource is probably needed for some navigation in the future</li>\n<li>preload: resource might be needed during the current navigation</li>\n</ul>\n<p>Simple prefetch example can be having a <code>HomePage</code> component, which renders a <code>LoginButton</code> component which then on demand loads a <code>LoginModal</code> component after being clicked.</p>\n<p><strong>LoginButton.js</strong></p>\n<pre><code class="hljs language-js"><span class="token comment">//...</span>\n<span class="token keyword">import</span><span class="token punctuation">(</span><span class="token comment">/* webpackPrefetch: true */</span> <span class="token string">\'LoginModal\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>\n<p>This will result in <code>&#x3C;link rel="prefetch" href="login-modal-chunk.js"></code> being appended in the head of the page, which will instruct the browser to prefetch in idle time the <code>login-modal-chunk.js</code> file.</p>\n<blockquote class="tip">\n<p>webpack will add the prefetch hint once the parent chunk has been loaded.</p>\n</blockquote>\n<p>Preload directive has a bunch of differences compared to prefetch:</p>\n<ul>\n<li>A preloaded chunk starts loading in parallel to the parent chunk. A prefetched chunk starts after the parent chunk finishes loading.</li>\n<li>A preloaded chunk has medium priority and is instantly downloaded. A prefetched chunk is downloaded while the browser is idle.</li>\n<li>A preloaded chunk should be instantly requested by the parent chunk. A prefetched chunk can be used anytime in the future.</li>\n<li>Browser support is different.</li>\n</ul>\n<p>Simple preload example can be having a <code>Component</code> which always depends on a big library that should be in a separate chunk.</p>\n<p>Let\'s imagine a component <code>ChartComponent</code> which needs huge <code>ChartingLibrary</code>. It displays a <code>LoadingIndicator</code> when rendered and instantly does an on demand import of <code>ChartingLibrary</code>:</p>\n<p><strong>ChartComponent.js</strong></p>\n<pre><code class="hljs language-js"><span class="token comment">//...</span>\n<span class="token keyword">import</span><span class="token punctuation">(</span><span class="token comment">/* webpackPreload: true */</span> <span class="token string">\'ChartingLibrary\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>\n<p>When a page which uses the <code>ChartComponent</code> is requested, the charting-library-chunk is also requested via <code>&#x3C;link rel="preload"></code>. Assuming the page-chunk is smaller and finishes faster, the page will be displayed with a <code>LoadingIndicator</code>, until the already requested <code>charting-library-chunk</code> finishes. This will give a little load time boost since it only needs one round-trip instead of two. Especially in high-latency environments.</p>\n<blockquote class="tip">\n<p>Using webpackPreload incorrectly can actually hurt performance, so be careful when using it.</p>\n</blockquote>\n<h2 id="bundle-analysis">Bundle Analysis<a href="#bundle-analysis" aria-hidden="true"><span class="icon icon-link"></span></a></h2>\n<p>Once you start splitting your code, it can be useful to analyze the output to check where modules have ended up. The <a href="https://github.com/webpack/analyse">official analyze tool</a> is a good place to start. There are some other community-supported options out there as well:</p>\n<ul>\n<li><a href="https://alexkuz.github.io/webpack-chart/">webpack-chart</a>: Interactive pie chart for webpack stats.</li>\n<li><a href="https://chrisbateman.github.io/webpack-visualizer/">webpack-visualizer</a>: Visualize and analyze your bundles to see which modules are taking up space and which might be duplicates.</li>\n<li><a href="https://github.com/webpack-contrib/webpack-bundle-analyzer">webpack-bundle-analyzer</a>: A plugin and CLI utility that represents bundle content as a convenient interactive zoomable treemap.</li>\n<li><a href="https://webpack.jakoblind.no/optimize">webpack bundle optimize helper</a>: This tool will analyze your bundle and give you actionable suggestions on what to improve to reduce your bundle size.</li>\n<li><a href="https://github.com/bundle-stats/bundle-stats">bundle-stats</a>: Generate a bundle report(bundle size, assets, modules) and compare the results between different builds.</li>\n</ul>\n<h2 id="next-steps">Next Steps<a href="#next-steps" aria-hidden="true"><span class="icon icon-link"></span></a></h2>\n<p>See <a href="/guides/lazy-loading/">Lazy Loading</a> for a more concrete example of how <code>import()</code> can be used in a real application and <a href="/guides/caching/">Caching</a> to learn how to split code more effectively.</p>\n'}}]);