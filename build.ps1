$root = (Resolve-Path .\).Path
$app = $root + ('\app')
$binDir = $root + ('\binary\resources')

echo "Homekit App Packaging"
echo "Order of business: "
echo "1. Deleting any existing installers"
echo "2. Changing working directory to 'binary/resources'"
echo "2.1. Deleting app.asar package"
echo "3. Changing working directory to root"
echo "3.1. Changing working directory to 'app'"
echo "4. Deleting any existing .asar packages"
echo "4.1. Creating fresh app.asar package"
echo "5. Moving app.asar to the binary resource folder"
echo "6. Building application installer"

del appd -recurse
echo "."
cd $binDir
echo "."
del app.asar
echo "."
cd $root
echo "."
cd app
echo "."
del *.asar
echo "."
asar pack . app.asar
echo "."
Move-Item app.asar $binDir
echo "."
cd $app
echo "."
node installer.js
echo "."
echo "7. DONE!"

pause