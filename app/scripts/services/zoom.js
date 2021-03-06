'use strict';

/**
 * @ngdoc service
 * @name loggrioApp.zoom
 * @description
 * # zoom
 * Service in the loggrioApp.
 */
angular.module('loggrioApp')
  .service('zoom', function () {
    var self = this;

    var MONTH = 30 * 24 * 3600 * 1000;
    var WEEK = 7 * 24 * 3600 * 1000;
    var DAY = 24 * 3600 * 1000;
    var HOUR = 3600 * 1000;
    var LAST_5 = 5 * 60 * 1000;

    var SINGLE_STEP_RATIO = 0.25;

    function singleStep(min, max) {
      return (max - min) * SINGLE_STEP_RATIO;
    }

    this.ranges = [{
      name: 'M',
      value: MONTH
    }, {
      name: 'W',
      value: WEEK
    }, {
      name: 'T',
      value: DAY
    }, {
      name: 'S',
      value: HOUR
    }, {
      name: '5m',
      value: LAST_5
    }];

    this.selectRange = function (chart, value) {
      if (!chart) {
        return;
      }
      var max = chart.series[0].xAxis.dataMax;
      var min = max - value;
      chart.xAxis[0].setExtremes(min, max);
    };

    this.zoomIn = function (chart) {
      if (!chart) {
        return;
      }
      var extremes = chart.xAxis[0].getExtremes();
      var max = extremes.max;
      var min = extremes.min;
      chart.xAxis[0].setExtremes(min + singleStep(min, max), max - singleStep(min, max));
    };

    this.zoomOut = function (chart) {
      if (!chart) {
        return;
      }
      var extremes = chart.xAxis[0].getExtremes();
      var max = extremes.max;
      var min = extremes.min;
      chart.xAxis[0].setExtremes(min - singleStep(min, max), max + singleStep(min, max));
    };

    this.navigateLeft = function (chart) {
      if (!chart) {
        return;
      }
      var extremes = chart.xAxis[0].getExtremes();
      var max = extremes.max;
      var min = extremes.min;
      chart.xAxis[0].setExtremes(min - singleStep(min, max), max - singleStep(min, max));
    };

    this.navigateRight = function (chart) {
      if (!chart) {
        return;
      }
      var extremes = chart.xAxis[0].getExtremes();
      var max = extremes.max;
      var min = extremes.min;
      chart.xAxis[0].setExtremes(min + singleStep(min, max), max + singleStep(min, max));
    };

    this.resetZoom = function (chart) {
      if (!chart) {
        return;
      }
      chart.zoomOut();
    };

    this.shift = function (chart, lastPoint) {
      if (!chart) {
        return;
      }
      var extremes = chart.xAxis[0].getExtremes();
      var max = extremes.max;
      var min = extremes.min;
      var xData = chart.series[0].xData;
      var beforeLastPoint = xData[xData.length - 1];
      var diff = lastPoint - beforeLastPoint;
      chart.xAxis[0].setExtremes(min + diff, max + diff, false);
    };

    this.getZoomNavigation = function (charts) {
      return {
        selectRange: function (chartIndex, value) {
          self.selectRange(charts[chartIndex].default.getHighcharts(), value);
        },
        zoomIn: function (chartIndex) {
          self.zoomIn(charts[chartIndex].default.getHighcharts());
        },
        zoomOut: function (chartIndex) {
          self.zoomOut(charts[chartIndex].default.getHighcharts());
        },
        navigateLeft: function (chartIndex) {
          self.navigateLeft(charts[chartIndex].default.getHighcharts());
        },
        navigateRight: function (chartIndex) {
          self.navigateRight(charts[chartIndex].default.getHighcharts());
        },
        resetZoom: function (chartIndex) {
          self.resetZoom(charts[chartIndex].default.getHighcharts());
        }
      };
    };
  });
