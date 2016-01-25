/*
 * jquery.cssify 1.0 - jQuery Plugin (1.5+)
 * Automatically creates empty CSS rules from HTML code.
 * 
 * Copyright (c) 2016 Héctor Ayestarán (http://www.programadorfreelance.es)
 * Dual licensed under the MIT and GPL licenses.
 */
;(function($, undefined) {

	/**
	 * Plugin constructor.
	 * 
	 * @param {Object} cnf Plugin configuration. See default options: defaultConfig.
	 * @returns {Void}
	 */	
	$.fn.cssify = function(cnf) {
		
		var css = 'This CSS was generated by Hector Ayestaran\'s jquery.cssify:\n\n';
		var tags = ['a','abbr','address','area','article','aside','audio','b','base','bdi','bdo','blockquote','body','br','button','canvas','caption','cite','code','col','colgroup','command','datalist','dd','del','details','dfn','div','dl','dt','em','embed','fieldset','figcaption','figure','footer','form','h1','h2','h3','h4','h5','h6','head','header','hgroup','hr','html','i','iframe','img','input','ins','kbd','keygen','label','legend','li','link','map','mark','menu','meta','meter','nav','noscript','object','ol','optgroup','option','output','p','param','pre','progress','q','rp','rt','ruby','s','samp','script','section','select','small','source','span','strong','style','sub','summary','sup','table','tbody','td','textarea','tfoot','th','thead','time','title','tr','track','u','ul','var','video','wbr'];
		var child = null;
		var defaultConfig = { 
			numberOfClassNames: 1, 
			includeParentCss: true, 
			includeId: false, 
			includeTagName: true, 
			nestRules: true, 
			oneLineRules: false, 
			excludeTags: 'br,head' 
		};
		
		// set config
		var config = cnf!==undefined? cnf : {};
		
		// check config params, set default if none
		for(var key in defaultConfig) 
			config[key] = config[key]!==undefined? config[key] : defaultConfig[key];

		config.excludeTags = ','+ config.excludeTags +',';
		
		
		// Debug method
		var lg = function(s) { console.log(s); };

	
		/**
		 * Turns the given HTML code into a valid XHTML code.
		 * 
		 * @param {String} HTML to be XMLfied.
		 * @returns {String}
		 */
		var xmlifyHtml = function(html) {
			
			/**
			 * Strips scripts away from the given HTML code.
			 * @author RobG@stackoverflow.com
			 * @param {String} s HTML code
			 * @param {String} type Example: 'script' , 'style'
			 * @returns {String} Scriptless HTML code.
			 */
			var stripScripts = function(s, type) {
				var div = document.createElement('div');
				div.innerHTML = s;
				var scripts = div.getElementsByTagName(type);
				var i = scripts.length;
				while (i--) {
					scripts[i].parentNode.removeChild(scripts[i]);
				}
				return div.innerHTML;
			};
			
			/**
			 * Checks if the given HTML tag can contain inner text or HTML. Example: br is simple, div isn't.
			 * @param {String} HTML tag to be checked.
			 * @returns {Boolean}
			 */
			var isSimpleTag = function(tag) {

				var a = document.createElement('div');
				var b = document.createElement(tag);

				$(a).append(b);

				if($(a).html().indexOf('/') !== -1)
					return false;
				else
					return true;
			};
			
			// remove js and style scripts
			html = stripScripts(html, 'script');
			html = stripScripts(html, 'style');
			
			// turn unclosed tags into closed: <br> -> <br />
			for(i=0; i<tags.length; i++) {
				if(isSimpleTag(tags[i])) {

					var re = new RegExp("<"+ tags[i] +" ?(.*)>", 'gim');
					html = html.replace(re, "<"+ tags[i] +" $1 />");
				}
			}

			return html;
		};
		

		/**
		 * Returns a given child element's CSS code.
		 * 
		 * @returns {String}
		 */
		var buildChildCss = function() {
			
			/**
			 * Returns a period char separated CSS classes string.
			 * @returns {String}
			 */
			var buildClassList = function(n) {

				var classNames = '';
				// number of classes to chain
				var numberOfClassNames = config.numberOfClassNames;
				// forced number of classes value if no css available due to config params
				numberOfClassNames = n!==undefined? n : numberOfClassNames;

				// no CSS classes
				if(child.classList.length===0)
					return '';
				
				// run node's classname list
				for(var i=0; i<child.classList.length; i++) {

					if(i===numberOfClassNames)
						break;

					classNames += '.'+ child.classList[i];
				}

				return classNames;
			};

			var classNames = buildClassList();

			var childCss =	(config.includeTagName? child.nodeName : '')  + 
							(config.includeId && child.id? '#'+child.id : '') + 
							classNames;
				
			// no css built out of the current config? we build the default one
			if(!childCss) 
				childCss = child.nodeName + buildClassList(defaultConfig.numberOfClassNames);

			return childCss;
		};
		
		
		/**
		 * Recursive method.
		 * Runs the given DOM node's children in search of any grandson to run them too.
		 * 
		 * @param {Object} node DOM node.
		 * @param {Number} level Nesting level. Used to build tab characters just before a given CSS rule.
		 * @param {String} parentCss Actual element's ancestor's CSS code.
		 * @returns {Void}
		 */
		var runChildren = function(node, level, parentCss) {

			var tab = '', childCss = '';

			// nesting tabs
			if(config.nestRules) {
				for(var i=1; i<=level; i++) 
					tab += "\t";
			}
			
			// run element's children
			for(var i=0; i<node.childElementCount; i++) {
				
				child = node.children[i];
				
				// child excluded?
				if(config.excludeTags.indexOf(','+ child.nodeName +',') !== -1)
					continue;
				
				// css code
				childCss = (config.includeParentCss && parentCss? parentCss +' > ' : '') + buildChildCss();

				css += tab + childCss +' {';
				
				if(!config.oneLineRules)
					css += "\n";
				
				css += tab +"}\n";	

				// run child if has any grandson
				if(node.children[i].childElementCount > 0)
					runChildren(node.children[i], level+1, childCss);
			}
		};
		
		
		// main element's DOM data
		var data = jQuery.parseXML('<'+ $(this)[0].nodeName.toLowerCase() +' id="'+ $(this).attr('id') +'"  class="'+ $(this).attr('class') +'">'+ xmlifyHtml($(this).html()) + '</'+ $(this)[0].nodeName.toLowerCase()  +'>');
		
		child = data.children[0];
		
		// main elements CSS code
		childCss = buildChildCss(); 
		
		css += childCss +' {';
		
		if(!config.oneLineRules)
			css += "\n";
		
		css += "}\n";
		
		// run main element's children if any
		if(child.childElementCount > 0)
			runChildren(child, 1, childCss);

		console.log(css);
	};

})(jQuery);