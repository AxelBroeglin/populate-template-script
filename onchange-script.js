function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading || newValue === '') {
        return;
    }

    if (isTemplate == true) {
        try {
            // Get the sys_id of the caller
            var caller = g_form.getValue('caller_id');
            // Server call to retrieve email with sys_id
            var callerInfo = new GlideRecord('sys_user');
            callerInfo.get(caller);
            // Caller Email address
            var callerEmail = callerInfo.email;

            // Get sys_id of the location
            var location = g_form.getValue('location');
            // Server call to retrieve store info with sys_id
            var storeLocation = new GlideRecord('cmn_location');
            storeLocation.get(location);
            // Get store name
            var storeName = storeLocation.name;
            // Get store number
            var storeNumber = storeLocation.u_store_number;
            // Get store street
            var storeStreet = storeLocation.street;
            // Get the short description
            var shortDesc = g_form.getValue('short_description');
            // Split into array with /
            var splitShortDesc = shortDesc.split("/");
            // Update relevant entries of newly created array
            var updatedShortDesc = splitShortDesc.map(function(lineOfShortDesc) {
                if (lineOfShortDesc === 'StoreNumber ') {
                    return storeNumber + ' ';
                } else if (lineOfShortDesc === ' City ') {
                    return ' ' + storeName + ' ';
                } else {
                    return lineOfShortDesc;
                }
            });
            // Join array into string
            shortDesc = updatedShortDesc.join("/");
            // Set short desc value with updated info
            g_form.setValue('short_description', shortDesc);

            // Get the description
            var desc = g_form.getValue('description');
            // Split into array with \n
            var splitDesc = desc.split("\n");

            // Update relevant entries of newly created array, anticipating possible lines according to the different applicable templates
            var updatedDesc = splitDesc.map(function(lineOfDesc) {
                if (lineOfDesc === 'Contact Phone Number: ') {
                    return lineOfDesc + ' 70' + storeNumber + 'xx';
                } else if (lineOfDesc === 'Store Full Address: ') {
                    return lineOfDesc + storeStreet;
                } else if (lineOfDesc === 'Contact e-mail: ') {
                    return lineOfDesc + callerEmail;
                } else if (lineOfDesc === 'Store Name & Number: ') {
                    return lineOfDesc + storeName + ' ' + storeNumber;
                } else {
                    return lineOfDesc;
                }
            });
            // Join array into string
            desc = updatedDesc.join("\n");
            // Set desc value with updated info
            g_form.setValue("description", desc);
        } catch (err) {
            // Catch any errors that occur and log them to the console
            console.log('An error occurred: ' + err);
        }
    }
}