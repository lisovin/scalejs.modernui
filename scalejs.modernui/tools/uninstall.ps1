param($installPath, $toolsPath, $package, $project)

$project |
	Remove-Paths 'scalejs.modernui, dropdown' |
	Remove-ScalejsExtension 'scalejs.modernui' |
	Out-Null
