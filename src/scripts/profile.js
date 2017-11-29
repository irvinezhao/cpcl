
// profile
let showProfileEl = document.querySelector('.profile-more-details')
showProfileEl.addEventListener('click', function () {
	let profileDropdownEl = document.querySelector('.profile-dropdown')
	let arrow = document.createElement('div');
	arrow.setAttribute('class', 'profile-dropdown-arrow')
	profileDropdownEl.appendChild(arrow)
	profileDropdownEl.classList.toggle('show')
	let profileBlockEl = document.querySelector('.topbar__profile-block')

	let dropdownItemEl = document.querySelectorAll('.profile-dropdown-item')
	dropdownItemEl.forEach(function (i) {
		i.style.width = profileBlockEl.offsetWidth - 3 + 'px';
	});
});

// notification
let showNotificationEl = document.querySelector('.notification-icon')
showNotificationEl.addEventListener('click', function () {
	let notificationDropdownEl = document.querySelector('.notification-dropdown')
	let arrow = document.createElement('div');
	arrow.setAttribute('class', 'notification-dropdown-arrow')
	notificationDropdownEl.appendChild(arrow)
	notificationDropdownEl.classList.toggle('show')
});

// search
let showSearchEl = document.querySelector('.search-icon')
showSearchEl.addEventListener('click', function () {
	let searchDropdownEl = document.querySelector('.search-dropdown')
	searchDropdownEl.classList.toggle('show')
});

new autoComplete({
	selector: 'input[name="topbarSearch"]',
	minChars: 1,
	source: function (term, suggest) {
		term = term.toLowerCase();
		var choices = ['ActionScript', 'AppleScript', 'Asp', 'Assembly', 'BASIC', 'Batch', 'C', 'C++', 'CSS', 'Clojure', 'COBOL', 'ColdFusion', 'Erlang', 'Fortran', 'Groovy', 'Haskell', 'HTML', 'Java', 'JavaScript', 'Lisp', 'Perl', 'PHP', 'PowerShell', 'Python', 'Ruby', 'Scala', 'Scheme', 'SQL', 'TeX', 'XML'];
		var matches = [];
		for (i = 0; i < choices.length; i++)
			if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
		suggest(matches);
	}
});