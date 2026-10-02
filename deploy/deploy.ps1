# Same as deploy.sh, for PowerShell:  .\deploy\deploy.ps1
$ErrorActionPreference = 'Stop'
$HostName = if ($env:CARTER_HOST) { $env:CARTER_HOST } else { 'root@68.183.130.3' }
npm run build
if ($LASTEXITCODE -ne 0) { throw 'build failed' }
tar czf carter-deploy.tgz dist server package.json deploy
scp carter-deploy.tgz "${HostName}:/tmp/carter-deploy.tgz"
Remove-Item carter-deploy.tgz
# Strip CRs: with git's autocrlf this file is checked out with CRLF, and bash on the server chokes on them.
$Remote = @'
set -e
mkdir -p /opt/Carter && cd /opt/Carter
rm -rf dist && tar xzf /tmp/carter-deploy.tgz --exclude=.env && rm /tmp/carter-deploy.tgz
chown -R root:root /opt/Carter && chmod -R u=rwX,go=rX dist server deploy package.json
if systemctl is-enabled --quiet carter-web 2>/dev/null; then
  systemctl restart carter-web && sleep 1
  curl -fsS -o /dev/null -w "health: HTTP %{http_code}\n" -H "Accept: text/html" http://127.0.0.1:3004/
else
  echo "Files are in /opt/Carter. First deploy: follow deploy/DEPLOY.md steps 3-5."
fi
'@
ssh $HostName ($Remote -replace "`r", '')
