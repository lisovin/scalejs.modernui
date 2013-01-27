param($installPath, $toolsPath, $package, $project)

$project |
	Remove-Paths 'scalejs.modernui' |
	Remove-ScalejsExtension 'scalejs.modernui' |
	Out-Null
