// Shared engine for the standalone scoreboard fragments (scoreboard-names.html,
// scoreboard-scores.html, scoreboard-round.html, scoreboard-pronouns.html).
//
// Each fragment HTML sets window.scComponents to the list of pieces it renders
// (e.g. ['names']) before this script runs. The fragment then polls the SAME
// streamcontrol.json as the full board, so a single StreamControl flow drives
// everything. Fragments are meant to be dropped into OBS as individual browser
// sources and positioned independently over a custom overlay image, so they
// intentionally skip the built-in background shapes, logos and per-game layout
// shifts of the full board.
//
// The original scoreboard.html / scoreboard.js are not touched by any of this.

window.onload = initFragment;

function initFragment(){

	var streamJSON = '../sc/streamcontrol.json'; //same data source as the full board
	var components = window.scComponents || []; //which pieces this fragment renders
	var offsetStep = (typeof window.offsetStep === 'number') ? window.offsetStep : 10; //px shifted outward per dropdown increment (matches the full board default)

	var nameFont = '30px'; //base font sizes, must match the values in style.css
	var scoreFont = '34px';
	var roundFont = '22px';
	var pronounFont = '18px';

	var xhr = new XMLHttpRequest();
	var scObj; //parsed streamcontrol data
	var startup = true; //first successful poll plays the load-in fade
	var cBust = 0; //cache-busting counter
	var prev = {}; //last-rendered values, so we only re-animate when something actually changes

	xhr.overrideMimeType('application/json');

	function has(c){ return components.indexOf(c) !== -1; }

	// Pixels to shift a side outward, driven by the 0-10 dropdowns in StreamControl.
	function offsetPx(key){ return (parseInt(scObj[key], 10) || 0) * offsetStep; }

	// Shrink the font until the text fits inside its fixed-width box (same approach as the full board).
	function resize(sel, baseFont){
		var node = $(sel)[0];
		if(!node) return;
		$(sel).css('font-size', baseFont);
		while((node.scrollWidth > node.offsetWidth || node.scrollHeight > node.offsetHeight)
			&& parseFloat($(sel).css('font-size')) > 6){
			$(sel).css('font-size', (parseFloat($(sel).css('font-size')) * .95) + 'px');
		}
	}

	// Generic renderer for one text element: keeps its outward offset live every poll,
	// and fades the text out/in only when the value actually changes.
	// dir: -1 for the left (P1) side, +1 for the right (P2) side, 0 for centered.
	function renderItem(sel, cacheKey, html, dir, offsetKey, baseFont, opacityTarget){
		var $el = $(sel);
		if(!$el.length) return;
		if(typeof opacityTarget !== 'number') opacityTarget = 1;

		TweenMax.set(sel, {css:{x: dir * offsetPx(offsetKey)}}); //apply offset every poll so dropdown changes take effect immediately

		if(prev[cacheKey] === html) return;
		prev[cacheKey] = html;

		if(startup){
			$el.html(html);
			resize(sel, baseFont);
			TweenMax.to(sel, .3, {css:{opacity: opacityTarget}, ease:Quad.easeOut, delay:.2});
		} else {
			TweenMax.to(sel, .3, {css:{opacity: 0}, ease:Quad.easeOut, onComplete:function(){
				$el.html(html);
				resize(sel, baseFont);
				TweenMax.to(sel, .3, {css:{opacity: opacityTarget}, ease:Quad.easeOut, delay:.1});
			}});
		}
	}

	function applyColors(){
		// Same custom-property scheme as the full board; blank falls back to the stylesheet default.
		if(scObj['mainColor']) document.documentElement.style.setProperty('--accent-color', scObj['mainColor']);
		else document.documentElement.style.removeProperty('--accent-color');
		if(scObj['teamColor']) document.documentElement.style.setProperty('--team-color', scObj['teamColor']);
		else document.documentElement.style.removeProperty('--team-color');
	}

	function buildName(team, name){
		return '<span class="teams">' + (team || '') + '</span> <span class="names">' + (name || '') + '</span>';
	}

	function renderNames(){
		renderItem('#p1Wrapper', 'p1Name', buildName(scObj['p1Team'], scObj['p1Name']), -1, 'nameOffset', nameFont);
		renderItem('#p2Wrapper', 'p2Name', buildName(scObj['p2Team'], scObj['p2Name']), +1, 'nameOffset', nameFont);
	}

	function renderScores(){
		// Honor the 'Hide Score #s' toggle so the fragment matches the full board.
		var op = (scObj['hideScores'] === 'Hide') ? 0 : 1;
		renderItem('#p1Score', 'p1Score', String(scObj['p1Score'] || ''), -1, 'scoreOffset', scoreFont, op);
		renderItem('#p2Score', 'p2Score', String(scObj['p2Score'] || ''), +1, 'scoreOffset', scoreFont, op);
		if(prev.scoresOp !== op){ //react to the toggle even when the score value itself didn't change
			prev.scoresOp = op;
			TweenMax.to('.scores', .3, {css:{opacity: op}, ease:Quad.easeOut});
		}
	}

	function renderRound(){
		renderItem('#round', 'round', String(scObj['round'] || ''), 0, '_none', roundFont);
	}

	function renderPronouns(){
		renderItem('#p1Pronouns', 'p1Pronouns', String(scObj['p1Pronouns'] || ''), -1, 'pronounOffset', pronounFont);
		renderItem('#p2Pronouns', 'p2Pronouns', String(scObj['p2Pronouns'] || ''), +1, 'pronounOffset', pronounFont);
	}

	function render(){
		applyColors();
		if(has('names')) renderNames();
		if(has('scores')) renderScores();
		if(has('round')) renderRound();
		if(has('pronouns')) renderPronouns();
		startup = false;
	}

	function pollJSON(){
		xhr.open('GET', streamJSON + '?v=' + cBust, true); //query-string cache busting, same as the full board
		xhr.send();
		cBust++;
	}

	xhr.onreadystatechange = function(){
		if(xhr.readyState === 4){
			scObj = JSON.parse(xhr.responseText);
			render();
		}
	};

	pollJSON();
	setInterval(pollJSON, 500); //poll twice per second
}
