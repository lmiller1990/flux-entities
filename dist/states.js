"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
function baseState() {
    return {
        ids: [],
        all: {}
    };
}
exports.baseState = baseState;
function selectableState() {
    return __assign({}, baseState(), { selectedId: null });
}
exports.selectableState = selectableState;
function ajaxState() {
    return {
        touched: false,
        loading: false,
        errors: []
    };
}
exports.ajaxState = ajaxState;
function ajaxBaseState() {
    return __assign({}, baseState(), ajaxState());
}
exports.ajaxBaseState = ajaxBaseState;
function selectableAjaxBaseState() {
    return __assign({}, baseState(), ajaxState(), selectableState());
}
exports.selectableAjaxBaseState = selectableAjaxBaseState;
