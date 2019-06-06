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
exports.baseState = {
    ids: [],
    all: {}
};
exports.selectableState = __assign({}, exports.baseState, { selectedId: null });
exports.ajaxState = {
    touched: false,
    loading: false,
    errors: false
};
exports.ajaxBaseState = __assign({}, exports.baseState, exports.ajaxState);
exports.selectableAjaxBaseState = __assign({}, exports.baseState, exports.ajaxState, exports.selectableState);
