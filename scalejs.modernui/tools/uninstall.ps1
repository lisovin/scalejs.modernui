param($installPath, $toolsPath, $package, $project)

$project |
	Remove-Paths 'scalejs.modernui, dropdown, accordion' |
	Remove-ScalejsExtension 'scalejs.modernui' |
	Out-Null
