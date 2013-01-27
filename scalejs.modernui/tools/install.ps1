param($installPath, $toolsPath, $package, $project)

$project |
	Add-Paths "{
		'scalejs.modernui' : 'Scripts/scalejs.modernui-$($package.Version)',
		'jQuery'			: 'Scripts/jquery-1.9.0.min',
		'knockout'			: 'Scripts/knockout-2.2.1',
		'knockout.mapping'	: 'Scripts/knockout.mapping-latest'
	}" |
	Add-Shims "{
		'jQuery'			: {
			exports : 'jQuery'
		}
	}" |
	Add-ScalejsExtension 'scalejs.modernui' |
	Out-Null