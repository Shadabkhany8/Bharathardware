@echo off
set "LOCAL_MVN=C:\Users\abc\Desktop\BharatSponge\.tools\apache-maven-3.9.9\bin\mvn.cmd"
if exist "%LOCAL_MVN%" (
    call "%LOCAL_MVN%" %*
) else (
    mvn %*
)
