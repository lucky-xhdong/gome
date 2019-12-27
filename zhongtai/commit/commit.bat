
@echo off　
cd %1\dist
svn resolved static
svn resolved index.html
svn add  *
svn commit -m "svn commit code" *
