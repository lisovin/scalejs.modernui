﻿param($installPath, $toolsPath, $package, $project)

$project |
	Add-Paths "{
		'scalejs.modernui' : 'Scripts/scalejs.modernui-$($package.Version)',
		'knockout'			: 'Scripts/knockout-2.2.1',
		'knockout.mapping'	: 'Scripts/knockout.mapping-latest',
		'bPopup'			: 'Scripts/jquery.bpopup',
		'dropdown'			: 'Scripts/dropdown'
	}" |
	Add-Shims "{
		'bPopup'			: {
			deps: ['jQuery']
		},
		'dropdown'			: {
			deps: ['jQuery']
		}
	}" |
	Add-ScalejsExtension 'scalejs.modernui' |
	Out-Null