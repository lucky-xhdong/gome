@echo off　
cd %1
svn resolved dist
cd %1\dist
svn resolved static
svn resolved index.html
