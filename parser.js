function parseDriveFolderHomeData(data) {
    setBreadcrumbHeader("/root", "Home");
    for(var i=0; i<data.value.length; i++) {
        setTableEntry(
            data.value[i].name,
            data.value[i].createdDateTime.substring(0,10),
            data.value[i].lastModifiedBy.user.displayName,
            data.value[i].folder.childCount,
            data.value[i].parentReference.path
        );
    }
}

function parseDriveFolderHomeData2(data) {
    //setBreadcrumbHeader(pathObj);
    //setTableHeaderEntry();
    deleteTableEntries();

    for(var i=0; i<data.value.length; i++) {
        var name="", createdDateTime="", lastModifiedBy="", folderCount=-1, parentReference="";

        if("name" in data.value[i])
            name = data.value[i].name;
        
        if("createdDateTime" in data.value[i])
            createdDateTime = data.value[i].createdDateTime.substring(0,10);
        
        if("displayName" in data.value[i].lastModifiedBy.user)
            lastModifiedBy = data.value[i].lastModifiedBy.user.displayName;
        
        if("folder" in data.value[i])
            folderCount = data.value[i].folder.childCount;
        
        if("parentReference" in data.value[i])
            parentReference = data.value[i].parentReference.path;
        
        setTableEntry(
            name,
            createdDateTime,
            lastModifiedBy,
            folderCount,
            parentReference
        );
    }
}