# jquery.cssify

A jQuery plugin (1.5+).
Automatically creates empty CSS rules from HTML code and sends them to your console. 
Makes the mark-up job faster.


Javascript code
-----------------------------

```javascript
$('#test').cssify();
```
or
```javascript
$('#test').cssify({	// (default config:)

					numberOfClassNames: 1, // to chain with a period char Example: div.firstClass.secondClass
					includeParentCss: true, // DOM element path
					includeId: false, // Example: #myElement {}
					includeTagName: true, // Example: div {}
					nestRules: true, // nest with tabs by DOM element hierarchy
					oneLineRules: false, // whole rule in a line or not
					excludeTags: 'br,head' // HTML elements to ommit
				});
```

HTML code
-----------------------------
```html
<section id="test" class="root">

	<a class="photo">

		<div id="next" class="blue">

			<div class="verified"></div>
			<div class="new"></div>

			<p>Hello world!</p>

			<br>

			<img src="somepic.png" alt="">
		</div>
	</a>

	<a class="body mind">

		<div id="prev" class="red">

			<div class="note"></div>
			<div class="color"></div>

			<p>Bonjour le monde!</p>

			<br class="end">
		</div>
	</a>	

</section>
```

Console output
-----------------------------
```css
section.root {
}
	section.root > a.photo {
	}
		section.root > a.photo > div.blue {
		}
			section.root > a.photo > div.blue > div.verified {
			}
			section.root > a.photo > div.blue > div.new {
			}
			section.root > a.photo > div.blue > p {
			}
			section.root > a.photo > div.blue > img {
			}
	section.root > a.body {
	}
		section.root > a.body > div.red {
		}
			section.root > a.body > div.red > div.note {
			}
			section.root > a.body > div.red > div.color {
			}
			section.root > a.body > div.red > p {
			}
```
