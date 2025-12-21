// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  baseURL: 'http://192.168.1.10:5000/common/',
  production: false,
  ddMMyyyyRegEx: '^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-([12][0-9]{3})$',
  ddMMyyyyRegEx2: '^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/([12][0-9]{3})$',
  emailpattern: "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}",
  monthsOfYear: "^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$",
  ayStartMonths: "^(APR|MAY|JUN)$",
  cashbank: "^(C|B)$",
  gstin: "^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$",
  gstregex: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
  yesno: "^(Y|N)$",
  ifsc: "^[A-Za-z]{4}0[A-Z0-9a-z]{6}$",
  mobileno:"^[2-9][0-9]*$"
,  statecodes: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
    "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
    "31", "32", "33", "34", "35", "36", "37", "97"]
}
