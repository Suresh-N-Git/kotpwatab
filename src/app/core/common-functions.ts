import { AbstractControl, FormGroup } from "@angular/forms";
import { Observable, Subscription, throwError } from "rxjs";

export function ProperCaseStr(inPutStr: String) {
    let str = inPutStr.split(" ")
    let ProperCasedString: String = "";
    let firstChar: String;
    for (const eachWord of str) {
        firstChar = eachWord.charAt(0);
        if (eachWord === "") {
        } else if (eachWord.toUpperCase() === eachWord) {
            ProperCasedString = ProperCasedString + (eachWord.trim() + " ")
        } else if (firstChar <= '9' && firstChar >= '0') {
            ProperCasedString = ProperCasedString + (eachWord.trim() + " ");
        } else if (firstChar == '(') {
            ProperCasedString = ProperCasedString + (eachWord.trim() + " ");
        } else {
            ProperCasedString = ProperCasedString +
                firstChar.toUpperCase() +
                eachWord.substring(1).toLowerCase().trim() + " ";
        }
    }
    return ProperCasedString.trim();
}

export function UpperCasedStr(inPutStr: string) {
    return inPutStr.toUpperCase().trim();
}

export function ddMMyyyyToyyyyMMdd(inputStr: string) {
    let newdate;
    if (inputStr) {
        let regex = new RegExp('/', 'g');
        inputStr = inputStr.replace(regex, '-');
        // Using regex will replace all the occurence of the character
        // https://stackoverflow.com/questions/27087128/convert-dd-mm-yyyy-to-yyyy-mm-dd-format-using-javascript
        // let newInputStr = inputStr.replace('/', '-');
        // let newdate = inputStr.split("-").reverse().join("-");  // split on some char / reverse / join on some char
        newdate = inputStr.split("-").reverse().join("-");  // split on some char / reverse / join on some char
        // let newdate = inputStr.split("-").reverse().join("-");  // split on some char / reverse / join on some char
    }
    return newdate;
}


export function yyyyMMddToddMMYYYY(inputStr: String) {
    let newdate;
    let regex = new RegExp('/', 'g');
    if (inputStr) {
        inputStr = inputStr.replace(regex, '-');
        // Using regex will replace all the occurence of the character
        // https://stackoverflow.com/questions/27087128/convert-dd-mm-yyyy-to-yyyy-mm-dd-format-using-javascript
        // let newInputStr = inputStr.replace('/', '-');
        // let newdate = inputStr.split("-").reverse().join("-");  // split on some char / reverse / join on some char
        newdate = inputStr.split("-").reverse().join("-");  // split on some char / reverse / join on some char
        // let newdate = inputStr.split("-").reverse().join("-");  // split on some char / reverse / join on some char
    }
    return newdate;
}

export function CurrencyFormat(inputNo: { toLocaleString: (arg0: string, arg1: { maximumFractionDigits: number; style: string; currency: string; }) => String; }, Country?: string): String {
    let FormattedNo: String;
    Country = Country || "";
    if (Country === "US") {
        FormattedNo = inputNo.toLocaleString('en-US', {
            maximumFractionDigits: 2,
            style: 'currency',
            currency: 'USD'
        });
    }
    else {
        FormattedNo = inputNo.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            style: 'currency',
            currency: 'INR'
        });
    }
    return FormattedNo;
}

export function NumberFormat(inputNo: { toLocaleString: (arg0: string, arg1: { maximumFractionDigits: number; }) => String; }, Country?: string): String {
    let FormattedNo: String;
    Country = Country || "";
    if (Country === "US") {
        FormattedNo = inputNo.toLocaleString('en-US', {
            maximumFractionDigits: 2
        });
    }
    else {
        FormattedNo = inputNo.toLocaleString('en-IN', {
            maximumFractionDigits: 2
        });
    }
    return FormattedNo;
}

export function ISODateToIndianDate(IsoDate: { getDate: () => any; getMonth: () => number; getFullYear: () => any; }): String {
    let indianDate: String
    let dd = IsoDate.getDate();
    let mm = IsoDate.getMonth() + 1;
    let yyyy = IsoDate.getFullYear();
    indianDate = (dd <= 9 ? '0' + dd : dd) + '-' + (mm <= 9 ? '0' + mm : mm) + '-' + yyyy;
    return indianDate;
}


export function ISODateToyyyyMMdd(IsoDate: { getDate: () => any; getMonth: () => number; getFullYear: () => any; }): String {
    let yyyyMMdd: String
    let dd = IsoDate.getDate();
    let mm = IsoDate.getMonth() + 1;
    let yyyy = IsoDate.getFullYear();
    // yyyyMMdd = (dd <= 9 ? '0' + dd : dd) + '-' + (mm <= 9 ? '0' + mm : mm) + '-' + yyyy;
    yyyyMMdd = yyyy + '-' + (mm <= 9 ? '0' + mm : mm) + '-' + (dd <= 9 ? '0' + dd : dd);
    return yyyyMMdd;
}

export function returnCurrentFy(fyList: any[]): any {
    if (fyList.length === 0) {
        return null; // Handle empty array case
    }

    let fyCurrent = fyList.reduce(function (
        prev: { Fy_Id: string | number },
        current: { Fy_Id: string | number }
    ) {
        if (+current.Fy_Id != null && +current.Fy_Id > +prev.Fy_Id) {
            return current;
        }
        return prev; // Ensure a value is returned in all cases
    });

    return fyCurrent;
}

// export function nonZeroMatSelectValidation(control: AbstractControl): { [key: string]: any } | null {
//     // https://www.youtube.com/watch?v=pa9S8_3Rs8A   Without Passing Parameter into the function
//     // https://www.youtube.com/watch?v=2PfMVL0OIGg   WitH Passing Parameter into the function
//     // You can add the error message in the HTML
//     // <mat-error *ngIf="txtRefCollege_Id.hasError('ZeroValueSelected')">
//     //    Select College
//     // </mat-error>
//     // The hasError is identified by the return key string which in this case is ZeroValueSelected
//     const selValue: number = control.value;
//     if (selValue != 0) {
//         return null;
//     } else {
//         return { 'ZeroValueSelected': true };
//     }
// }


export function nonZeroMatSelectValidation(control: AbstractControl): { [key: string]: any } | null {
    // https://www.youtube.com/watch?v=pa9S8_3Rs8A   Without Passing Parameter into the function
    // https://www.youtube.com/watch?v=2PfMVL0OIGg   WitH Passing Parameter into the function
    // You can add the error message in the HTML
    // <mat-error *ngIf="txtRefCollege_Id.hasError('ZeroValueSelected')">
    //    Select College
    // </mat-error>
    // The hasError is identified by the return key string which in this case is ZeroValueSelected
    // declaring selValue as any takes care of a simple drop down where the value and text are same
    const selValue: any = control.value;
    if (selValue == null || selValue == 'undefined' || selValue != 0) {
        return null;
    } else {
        return { 'ZeroValueSelected': true };
    }
}

export function scrollToBottom() {
    // This seems to need a time out as other wise it does not work on first click
    // Add div tag to the bottom of page  <div id="bottomOfPage"></div>
    // https://stackoverflow.com/questions/43945548/scroll-to-element-on-click-in-angular-4
    // you can access a html element with its id by using querySelector with # added to the id
    setTimeout(() => {
        document.querySelector('#bottomOfPage')!.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 300)
}

export function RupeesToWords(inputNo: number) {
    var fraction = Math.round(frac(inputNo) * 100);
    var f_text = "";
    if (fraction > 0) {
        f_text = "and " + convert_number(fraction) + " Paise";
    }
    return convert_number(inputNo) + " Rupees " + f_text + " Only";
}

function frac(f: number) {
    return f % 1;
}

function convert_number(number: number) {
    if ((number < 0) || (number > 999999999999)) {
        return "Number Out of Range!";
    }
    var Gn = Math.floor(number / 10000000);  /* Crore */
    number -= Gn * 10000000;
    var kn = Math.floor(number / 100000);     /* lakhs */
    number -= kn * 100000;
    var Hn = Math.floor(number / 1000);      /* thousand */
    number -= Hn * 1000;
    var Dn = Math.floor(number / 100);       /* Tens (deca) */
    number = number % 100;               /* Ones */
    var tn = Math.floor(number / 10);
    var one = Math.floor(number % 10);
    var res = "";

    if (Gn > 0) {
        res += (convert_number(Gn) + " Crore");
    }
    if (kn > 0) {
        res += (((res == "") ? "" : " ") +
            convert_number(kn) + " Lakh");
    }
    if (Hn > 0) {
        res += (((res == "") ? "" : " ") +
            convert_number(Hn) + " Thousand");
    }

    if (Dn) {
        res += (((res == "") ? "" : " ") +
            convert_number(Dn) + " Hundred");
    }


    var ones = Array("", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen");
    var tens = Array("", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety");

    if (tn > 0 || one > 0) {
        if (!(res == "")) {
            res += " and ";
        }
        if (tn < 2) {
            res += ones[tn * 10 + one];
        }
        else {

            res += tens[tn];
            if (one > 0) {
                res += ("-" + ones[one]);
            }
        }
    }

    if (res == "") {
        res = "zero";
    }
    return res;
}

export function scrollToTop() {
    // This seems to need a time out as other wise it does not work on first click
    // Add div tag to the bottom of page  <div id="bottomOfPage"></div>
    // https://stackoverflow.com/questions/43945548/scroll-to-element-on-click-in-angular-4
    // you can access a html element with its id by using querySelector with # added to the id
    let obj = document.querySelector('#topOfPage')
    setTimeout(() => {
        if (obj) {
            obj.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, 300)
}

export function compareTwoDates(date1: Date, date2: Date) {
    if (date1 > date2) {
        return false;
    } else {
        return true;
    }
}

export function removeItemsFromArray(originalArray: string[], itemsToRemoveArray: string[]) {
    // // Remove all the items in the array which are to be removed. Loop backward to avoid index shifting.
    for (let i = originalArray.length - 1; i >= 0; i--) {
        if (itemsToRemoveArray.includes(originalArray[i])) {
            originalArray.splice(i, 1);
        }
    }
    return originalArray;
}

export function decompressJson(data: { keys: string[], rows: any[][] }): any[] {
    return data.rows.map(row => {
        const obj: any = {};

        data.keys.forEach((key, index) => {
            const parts = key.split('.');
            let current = obj;

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];

                // If it's the last part, assign the value
                if (i === parts.length - 1) {
                    current[part] = row[index];
                } else {
                    // Create nested object if not exists
                    if (!current[part]) current[part] = {};
                    current = current[part];
                }
            }
        });

        return obj;
    });
}


/**
 * Recursively flattens a nested object.
 * - Promotes inner values of 1-element object arrays to top-level keys.
 * - Skips parent key prefixing for such 1-object arrays.
 * - Handles nested objects and other array types safely.
 * 
 * @param {object} obj - The object to flatten.
 * @param {string} parentKey - Used for key prefixing in nested structures.
 * @param {string} delimiter - The character used to join nested keys.
 * @returns {object} - A flattened key-value map.
 */

function flattenObject(obj: object, parentKey: string = '', delimiter: string = '_'): object {
    const result = {}; // Final flattened key-value pairs

    for (const key in obj) {
        const value = obj[key];

        // Case 1: Array with 1 object → promote its keys to top level
        if (Array.isArray(value) && value.length === 1 && typeof value[0] === 'object') {
            // Recursively flatten the inner object, ignore current key as prefix
            Object.assign(result, flattenObject(value[0], '', delimiter));
        }

        // Case 2: Other arrays → serialize or handle differently if needed
        else if (Array.isArray(value)) {
            result[key] = JSON.stringify(value); // Default: flatten as JSON string
        }

        // Case 3: Nested object → recurse with full path
        else if (value !== null && typeof value === 'object') {
            // Build full key path like: parent_child_grandchild
            const newKey = parentKey ? `${parentKey}${delimiter}${key}` : key;
            Object.assign(result, flattenObject(value, newKey, delimiter));
        }

        // Case 4: Primitive value (string, number, boolean, null, etc.)
        else {
            const newKey = parentKey ? `${parentKey}${delimiter}${key}` : key;
            result[newKey] = value;
        }
    }
    return result;
}


/**
 * Flattens an array of nested objects row by row.
 * Each object becomes a flat object in the output array.
 * 
 * @param {Array<object>} arrayOfObjects - The array to process.
 * @returns {Array<object>} - Flattened objects, ready for table display or export.
 */

export function flattenJSONRowWise(arrayOfObjects: Array<object>): Array<object> {
    if (!Array.isArray(arrayOfObjects)) {
        throw new Error('Expected an array of objects');
    }

    // Map each nested object to a flattened version
    return arrayOfObjects.map(obj => flattenObject(obj));
}


// USAGE

// const flatArray = flattenJSONRowWise(nested);   -- This is java array
// const flatJson = JSON.stringify(flatArray, null, 2) -- this is JSON
// console.log(flatJson);


export function patchFormFromDisplayJson(
    form: FormGroup,
    displayJson: { [key: string]: any },
    tableSchema: any[],
    dropDownControls: string[],
    dateControls: string[]
): void {
    const patchObject: { [key: string]: any } = {};

    // 1. Handle dropdowns (label → value)
    dropDownControls.forEach(controlName => {
        const fieldSchema = tableSchema.find(f => f.txtname === controlName);
        if (!fieldSchema?.labelField || !fieldSchema?.valueField || !fieldSchema?.DisplayName) return;

        const displayKey = fieldSchema.DisplayName;
        const displayValue = displayJson[displayKey];

        if (displayValue != null) {
            const matchedOption = fieldSchema.options?.find(
                opt => (opt[fieldSchema.labelField] + '').toLowerCase() === (displayValue + '').toLowerCase()
            );

            if (matchedOption) {
                patchObject[controlName] = matchedOption[fieldSchema.valueField];
            } else {
                console.warn(`Dropdown label not matched for '${displayKey}': ${displayValue}`);
            }
        }
    });

    // 2. Handle date controls (dd/MM/yyyy → Date)
    dateControls.forEach(controlName => {
        const fieldSchema = tableSchema.find(f => f.txtname === controlName);
        if (!fieldSchema?.DisplayName) return;

        const displayKey = fieldSchema.DisplayName;
        const displayValue = displayJson[displayKey];

        if (typeof displayValue === 'string') {
            const parts = displayValue.split('-');
            if (parts.length === 3) {
                const [dd, mm, yyyy] = parts.map(p => parseInt(p, 10));
                patchObject[controlName] = new Date(yyyy, mm - 1, dd);
            } else {
                console.warn(`Invalid date format for '${displayKey}': ${displayValue}`);
            }
        }
    });

    // 3. Handle all other fields
    tableSchema.forEach(f => {
        const { txtname, DisplayName } = f;
        if (!txtname || !DisplayName) return;

        if (
            !dropDownControls.includes(txtname) &&
            !dateControls.includes(txtname) &&
            displayJson[DisplayName] != null
        ) {
            patchObject[txtname] = displayJson[DisplayName];
        }
    });

    // 4. Apply patch
    form.reset();
    form.patchValue(patchObject);
}

