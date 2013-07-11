﻿/* WorksheetView.js
 *
 * Author: Dmitry.Sokolov@avsmedia.net
 * Date:   Nov 21, 2011
 */
(	/**
	 * @param {jQuery} $
	 * @param {Window} window
	 * @param {undefined} undefined
	 */
	function ($, window, undefined) {


		/*
		 * Import
		 * -----------------------------------------------------------------------------
		 */
		var asc = window["Asc"];
		var asc_calcnpt = asc.calcNearestPt;
		var asc_getcvt  = asc.getCvtRatio;
		var asc_getprop = asc.getProperty;
		var asc_floor   = asc.floor;
		var asc_ceil    = asc.ceil;
		var asc_round   = asc.round;
		var asc_n2css   = asc.numberToCSSColor;
		var asc_n2Color   = asc.numberToAscColor;
		var asc_obj2Color = asc.colorObjToAscColor;
		var asc_typeof  = asc.typeOf;
		var asc_incDecFonSize  = asc.incDecFonSize;
		var asc_debug   = asc.outputDebugStr;
		var asc_Range   = asc.Range;
		var asc_FP      = asc.FontProperties;
		var asc_parsecolor = asc.parseColor;
		var asc_clone   = asc.clone;
		var asc_AF     = asc.AutoFilters;

		var asc_CCellFlag		= asc.asc_CCellFlag;
		var asc_CFont			= asc.asc_CFont;
		var asc_CFill			= asc.asc_CFill;
		var asc_CBorder			= asc.asc_CBorder;
		var asc_CBorders		= asc.asc_CBorders;
		var asc_CCellInfo		= asc.asc_CCellInfo;
		var asc_CCellRect		= asc.asc_CCellRect;
		var asc_CHyperlink		= asc.asc_CHyperlink;
		var asc_CPageOptions	= asc.asc_CPageOptions;
		var asc_CPageSetup		= asc.asc_CPageSetup;
		var asc_CPageMargins	= asc.asc_CPageMargins;
		var asc_CPagePrint		= asc.CPagePrint;
		var asc_CCollaborativeRange = asc.asc_CCollaborativeRange;
		var asc_CCellCommentator = asc.asc_CCellCommentator;

		/*
		* Constants
		* -----------------------------------------------------------------------------
		*/

		/**
		 * header styles
		 * @const
		 */
		var kHeaderDefault     = 0;
		var kHeaderActive      = 1;
		var kHeaderHighlighted = 2;
		var kHeaderSelected    = 3;

		/**
		 * text alignment style
		 * @const
		 */
		var khaLeft   = "left";
		var khaCenter = "center";
		var khaRight  = "right";
		var khaJustify= "justify";
		var kvaTop    = "top";
		var kvaCenter = "center";
		var kvaBottom = "bottom";

		/**
		 * cell border styles
		 * @const
		 */
		var kcbNone             = "none";
		var kcbThick            = "thick";
		var kcbThin             = "thin";
		var kcbMedium           = "medium";
		var kcbDashDot          = "dashDot";
		var kcbDashDotDot       = "dashDotDot";
		var kcbDashed           = "dashed";
		var kcbDotted           = "dotted";
		var kcbDouble           = "double";
		var kcbHair             = "hair";
		var kcbMediumDashDot    = "mediumDashDot";
		var kcbMediumDashDotDot = "mediumDashDotDot";
		var kcbMediumDashed     = "mediumDashed";
		var kcbSlantDashDot     = "slantDashDot";

		var kcbThinBorders      = [kcbThin, kcbDashDot, kcbDashDotDot, kcbDashed, kcbDotted, kcbHair];
		var kcbMediumBorders    = [kcbMedium, kcbMediumDashDot, kcbMediumDashDotDot, kcbMediumDashed, kcbSlantDashDot];
		var kcbThickBorders     = [kcbThick, kcbDouble];

		/**
		 * cursor styles
		 * @const
		 */
		var kCurDefault		= "default";
		var kCurCorner		= "pointer";
		var kCurCells		= "cell";
		var kCurColSelect	= "pointer";
		var kCurColResize	= "col-resize";
		var kCurRowSelect	= "pointer";
		var kCurRowResize	= "row-resize";
		// Курсор для автозаполнения
		var kCurFillHandle	= "crosshair";
		// Курсор для гиперссылки
		var kCurHyperlink	= "pointer";
		// Курсор для комментария
		var kCurComment		= "cell";
		// Курсор для перемещения области выделения
		var kCurMove		= "move";
		var kCurSEResize	= "se-resize";
		var kCurNEResize	= "ne-resize";

		/**
		 * cell border id
		 * @const
		 */
		var	kcbidLeft	= 1;
		var kcbidRight	= 2;
		var kcbidTop	= 3;
		var kcbidBottom = 4;
		var kcbidDiagonal = 5;
		var kcbidDiagonalDown = 6;
		var kcbidDiagonalUp = 7;

		var kNewLine = "\n";

		function calcDecades(num) {
			return Math.abs(num) < 10 ? 1 : 1 + calcDecades( asc_floor(num * 0.1) );
		}


		function CacheElement() {
			if ( !(this instanceof CacheElement) ) {
				return new CacheElement();
			}
			this.columnsWithText = {};							// Колонки, в которых есть текст
			this.columns = {};
			this.erasedRB = {};
			this.erasedLB = {};
			return this;
		}


		/**
		 * @param {String} style
		 * @param {Number} color
		 * @param {Number} width
		 * @param {Boolean} isErased
		 * @param {Boolean} isActive
		 */
		function CellBorder(style, color, width, isErased, isActive) {
			if ( !(this instanceof CellBorder) ) {
				return new CellBorder(style, color, width, isErased, isActive);
			}
			/** @type {String} */
			this.s = style !== undefined ? style : kcbNone;
			/** @type {Number} */
			this.c = color !== undefined ? color.getRgb() : 0;
			/** @type {Number} */
			this.w = width !== undefined ? width : 0;
			/** @type {Boolean} */
			this.isErased = isErased !== undefined ? isErased : false;
			/** @type {Boolean} */
			this.isActive = isActive !== undefined ? isActive : true;
			return this;
		}


		function WorksheetViewSettings() {
			if ( !(this instanceof WorksheetViewSettings) ) {
				return new WorksheetViewSettings();
			}
			this.header = {
				fontName: "Calibri",
				fontSize: 11,
				style: [
				// Old header colors
				/*{ // kHeaderDefault
					background: "#DFE3E8",
					border: "#B1B5BA",
					color: "#363636"
				},
				{ // kHeaderActive
					background: "#FFDD62",
					border: "#C28A30",
					color: "#363636"
				},
				{ // kHeaderHighlighted
					background: "#FFEDA9",
					border: "#E8BF3A",
					color: "#656A70"
				},
				{ // kHeaderSelected
					background: "#AAAAAA",
					border: "#75777A",
					color: "#363636"
				}*/


				// New header colors
				{ // kHeaderDefault
					background: "#F4F4F4",
					border: "#D5D5D5",
					color: "#363636"
				},
				{ // kHeaderActive
					background: "#C1C1C1",
					border: "#929292",
					color: "#363636"
				},
				{ // kHeaderHighlighted
					background: "#DFDFDF",
					border: "#AFAFAF",
					color: "#656A70"
				},
				{ // kHeaderSelected
					background: "#AAAAAA",
					border: "#75777A",
					color: "#363636"
				}
				],
				cornerColor: "#C1C1C1"
			};
			this.cells = {
				fontName: "Calibri",
				fontSize: 11,
				defaultState: {
					background: "#FFF",
					border: "#DADCDD",
					color: "#000",
					colorNumber : 0
				},
				padding: 3/*px horizontal padding*/
			};
			this.activeCellBorderColor			= "rgba(105,119,62,0.7)";
			this.activeCellBackground			= "rgba(157,185,85,.2)";

			//this.activeCellBorderColor			= "rgba(0,0,255,.5)";
			//this.activeCellBackground			= "rgba(190,190,255,.5)";
			// this.formulaRangeBorderColor		= "rgba(0,0,255,1)";
				this.formulaRangeBorderColor		= [	"rgba(0,53,214,1)",
														"rgba(216,0,0,1)",
														"rgba(214,160,0,1)",
														"rgba(107,214,0,1)",
														"rgba(0,214,53,1)",
														"rgba(0,214,214,1)",
														"rgba(107,0,214,1)",
														"rgba(214,0,160,1)" ];
			// Цвет заливки границы выделения области автозаполнения
			this.fillHandleBorderColorSelect	= "rgba(255,255,255,1)";
			//this.fillHandleBorderColorSelect	= "rgba(255,255,0,1)";
			return this;
		}

		function Cache() {
			if ( !(this instanceof Cache) ) {
				return new Cache();
			}

			this.rows = {};
			this.mergedCells = {
				index: {},
				ranges: []
			};
			this.sectors = [];

			this.reset = function () {
				this.rows = {};
				this.mergedCells.index = {};
				this.mergedCells.ranges = [];
				this.sectors = [];
			};

			// Structure of cache
			//
			// cache : {
			//
			//   rows : {
			//     0 : {
			//       columns : {
			//         0 : {
			//           borders : {
			//             b : CellBorder,
			//             l : CellBorder,
			//             r : CellBorder,
			//             t : CellBorder,
			//             dd : CellBorder,
			//             du : CellBorder
			//           },
			//           text : {
			//             cellHA  : String,
			//             cellVA  : String,
			//             cellW   : Number,
			//             color   : String,
			//             metrics : TextMetrics,
			//             sideL   : Number,
			//             sideR   : Number,
			//             state   : StringRenderInternalState
			//           }
			//         }
			//       },
			//       erasedLB : {
			//         1 : true, 2 : true
			//       },
			//       erasedRB : {
			//         0 : true, 1 : true
			//       }
			//     }
			//   },
			//
			//   mergedCells : {
			//     index : {
			//       "row-col" : Number
			//     },
			//     ranges: [
			//       {
			//         c1 : Number,
			//         r1 : Number,
			//         c2 : Number,
			//         r2 : Number
			//       }
			//     ]
			//   },
			//
			//   sectors: [
			//     0 : Range
			//   ]
			//
			// }
		}


		/**
		 * Widget for displaying and editing Worksheet object
		 * -----------------------------------------------------------------------------
		 * @param {Worksheet} model  Worksheet
		 * @param {Array} buffers    DrawingContext + Overlay
		 * @param {StringRender} stringRender    StringRender
		 * @param {Number} maxDigitWidth    Максимальный размер цифры
		 * @param {asc_CCollaborativeEditing} collaborativeEditing
		 * @param {Object} settings  Settings
		 *
		 * @constructor
		 * @memberOf Asc
		 */
		function WorksheetView(model, buffers, stringRender, maxDigitWidth, collaborativeEditing, settings) {
			if ( !(this instanceof WorksheetView) ) {
				return new WorksheetView(model, buffers, stringRender, maxDigitWidth, collaborativeEditing, settings);
			}

			this.settings = $.extend(true, {}, this.defaults, settings);

			var cells = this.settings.cells;
			cells.fontName = model.workbook.getDefaultFont();
			cells.fontSize = model.workbook.getDefaultSize();

			this.vspRatio = 1.275;

			this.model = model;

			this.buffers = buffers;
			this.drawingCtx = this.buffers.main;
			this.overlayCtx = this.buffers.overlay;
			this.shapeCtx = this.buffers.shapeCtx;
			this.shapeOverlayCtx = this.buffers.shapeOverlayCtx;

			this.stringRender = stringRender;

			// Флаг, сигнализирует о том, что мы сменили zoom, но это не активный лист (поэтому как только будем показывать, нужно перерисовать и пересчитать кеш)
			this.updateZoom = false;

			var cnv = $('<canvas width="2" height="2"/>')[0];
			var ctx = cnv.getContext("2d");
			ctx.clearRect(0, 0, 2, 2);
			ctx.fillStyle = "#000";
			ctx.fillRect(0, 0, 1, 1);
			ctx.fillRect(1, 1, 1, 1);
			this.ptrnLineDotted1 = ctx.createPattern(cnv, "repeat");

			this.cache = new Cache();

			//---member declaration---
			// Максимальная ширина числа из 0,1,2...,9, померенная в нормальном шрифте(дефалтовый для книги) в px(целое)
			// Ecma-376 Office Open XML Part 1, пункт 18.3.1.13
			this.maxDigitWidth = maxDigitWidth;

			this.nBaseColWidth = 8; // Число символов для дефалтовой ширины (по умолчинию 8)
			this.defaultColWidthChars = 0;
			this.defaultColWidth = 0;
			this.defaultRowHeight = 0;
			this.defaultRowDescender = 0;
			this.headersLeft = 0;
			this.headersTop = 0;
			this.headersWidth = 0;
			this.headersHeight = 0;
			this.cellsLeft = 0;
			this.cellsTop = 0;
			this.cols = [];
			this.rows = [];
			this.width_1px = 0;
			this.width_2px = 0;
			this.width_3px = 0;
			this.width_padding = 0;
			this.height_1px = 0;
			this.height_2px = 0;
			this.height_3px = 0;
			this.highlightedCol = -1;
			this.highlightedRow = -1;
			this.visibleRange = asc_Range(0, 0, 0, 0);
			this.activeRange = asc_Range(0, 0, 0, 0);
			this.activeRange.type = c_oAscSelectionType.RangeCells;
			this.activeRange.startCol = 0; // Активная ячейка в выделении
			this.activeRange.startRow = 0; // Активная ячейка в выделении
			this.isChanged = false;
			this.isCellEditMode = false;
			this.isFormulaEditMode = false;
			this.isChartAreaEditMode = false;
			this.lockDraw = false;

			this.isSelectDialogRangeMode = false;
			this.copyOfActiveRange = null;

			this.startCellMoveResizeRange = null;
			this.startCellMoveResizeRange2 = null;
			
			// Координаты ячейки начала перемещения диапазона
			this.startCellMoveRange = null;
			// Дипазон перемещения
			this.activeMoveRange = null;
			// Координаты fillHandle ("квадрата" автозаполнения)
			this.fillHandleL = 0;
			this.fillHandleT = 0;
			this.fillHandleR = 0;
			this.fillHandleB = 0;
			// Range fillHandle
			this.activeFillHandle = null;
			// Горизонтальное (0) или вертикальное (1) направление автозаполнения
			this.fillHandleDirection = -1;
			// Зона автозаполнения
			this.fillHandleArea = -1;
			this.nRowsCount = 0;
			this.nColsCount = 0;
			// Массив ячеек для текущей формулы
			this.arrActiveFormulaRanges = [];
			this.arrActiveChartsRanges = [];
			// Массив видимых hyperlink-ов
			this.visibleHyperlinks = [];
			//------------------------
			
			this.collaborativeEditing = collaborativeEditing;

			/**
			 * pictures, charts render
			 * @type DrawingObjects
			 */
			 
			if ( !this.settings.objectRender ) {
				this.objectRender = new DrawingObjects();
				this.objectRender.init(this);
			}
			else
				this.objectRender = this.settings.objectRender;
			
			this.cellCommentator = new asc_CCellCommentator(this);
			
			//auto filters
			this.autoFilters = new asc_AF();

			this._init();

			return this;
		}

		WorksheetView.prototype = {

			/** @type WorksheetView */
			constructor: WorksheetView,

			defaults: WorksheetViewSettings(),

			option: function (name, value) {
				var old = asc_getprop(name, this.settings);
				if (name !== undefined && value !== undefined) {
					var i = name.lastIndexOf(".");
					if (i < 0) {
						this.settings[name] = value;
					} else {
						var p = asc_getprop(name.slice(0, i), this.settings);
						if (p === undefined) {return false;}
						p[ name.slice(i + 1) ] = value;
					}
					return true;
				}
				return old;
			},

			getVisibleRange: function () {
				return this.visibleRange;
			},

			updateVisibleRange: function () {
				return this._updateCellsRange(this.getVisibleRange());
			},

			getFirstVisibleCol: function () {
				return this.visibleRange.c1;
			},

			getLastVisibleCol: function () {
				return this.visibleRange.c2;
			},

			getFirstVisibleRow: function () {
				return this.visibleRange.r1;
			},

			getLastVisibleRow: function () {
				return this.visibleRange.r2;
			},

			getHorizontalScrollRange: function () {
				var ctxW = this.drawingCtx.getWidth() - this.cellsLeft;
				for (var w = 0, i = this.cols.length - 1; i >= 0; --i) {
					w += this.cols[i].width;
					if (w > ctxW) {break;}
				}
				return i; // Диапазон скрола должен быть меньше количества столбцов, чтобы не было прибавления столбцов при перетаскивании бегунка
			},

			getVerticalScrollRange: function () {
				var ctxH = this.drawingCtx.getHeight() - this.cellsTop;
				for (var h = 0, i = this.rows.length - 1; i >= 0; --i) {
					h += this.rows[i].height;
					if (h > ctxH) {break;}
				}
				return i; // Диапазон скрола должен быть меньше количества строк, чтобы не было прибавления строк при перетаскивании бегунка
			},

			getCellsOffset: function (units) {
				var u = units >= 0 && units <= 3 ? units : 0;
				return {
					left: this.cellsLeft * asc_getcvt( 1/*pt*/, u, this._getPPIX() ),
					top: this.cellsTop * asc_getcvt( 1/*pt*/, u, this._getPPIY() )
				};
			},

			getCellLeft: function (column, units) {
				if (column >= 0 && column < this.cols.length) {
					var u = units >= 0 && units <= 3 ? units : 0;
					return this.cols[column].left * asc_getcvt( 1/*pt*/, u, this._getPPIX() );
				}
				return null;
			},

			getCellTop: function (row, units) {
				if (row >= 0 && row < this.rows.length) {
					var u = units >= 0 && units <= 3 ? units : 0;
					return this.rows[row].top * asc_getcvt( 1/*pt*/, u, this._getPPIY() );
				}
				return null;
			},

			getColumnWidth: function (index, units) {
				if (index >= 0 && index < this.cols.length) {
					var u = units >= 0 && units <= 3 ? units : 0;
					return this.cols[index].width * asc_getcvt( 1/*pt*/, u, this._getPPIX() );
				}
				return null;
			},

			getColumnWidthInSymbols: function (index) {
				if (index >= 0 && index < this.cols.length) {
					return this.cols[index].charCount;
				}
				return null;
			},

			getRowHeight: function (index, units) {
				if (index >= 0 && index < this.rows.length) {
					var u = units >= 0 && units <= 3 ? units : 0;
					return this.rows[index].height * asc_getcvt( 1/*pt*/, u, this._getPPIY() );
				}
				return null;
			},

			getSelectedColumnIndex: function () {
				return this.activeRange.startCol;
			},

			getSelectedRowIndex: function () {
				return this.activeRange.startRow;
			},

			getSelectedRange: function () {
				return this._getRange(this.activeRange.c1, this.activeRange.r1, this.activeRange.c2, this.activeRange.r2);
			},

			resize: function () {
				this._initCellsArea(true);
				this._normalizeViewRange();
				this._cleanCellsTextMetricsCache();
				this._prepareCellTextMetricsCache(this.visibleRange);
				return this;
			},

			getZoom: function () {
				return this.drawingCtx.getZoom();
			},

			changeZoom: function (isUpdate) {
				if (isUpdate) {
					this.cleanSelection();
					this._initCellsArea(false);
					this._normalizeViewRange();
					this._cleanCellsTextMetricsCache();
					this._shiftVisibleRange();
					this._prepareCellTextMetricsCache(this.visibleRange);
					this._shiftVisibleRange();
					this.cellCommentator.updateCommentPosition();
					
					this.shapeCtx.init(this.drawingCtx.ctx, this.drawingCtx.getWidth(0), this.drawingCtx.getHeight(0), this.drawingCtx.getWidth(3), this.drawingCtx.getHeight(3));
					this.shapeOverlayCtx.init(this.overlayCtx.ctx, this.overlayCtx.getWidth(0), this.overlayCtx.getHeight(0), this.overlayCtx.getWidth(3), this.overlayCtx.getHeight(3));

					this.updateZoom = false;
				} else {
					this.updateZoom = true;
				}
				return this;
			},
			
			graphicsChangeZoom: function (isUpdate, factor) {
				if ( isUpdate )
					this.objectRender.changeZoom(factor);
			},

			getCellTextMetrics: function (col, row) {
				var ct = this._getCellTextCache(col, row);
				return ct ? $.extend({}, ct.metrics) : undefined;
			},

			getSheetViewSettings: function () {
				return this.model.getSheetViewSettings();
			},


			// mouseX - это разница стартовых координат от мыши при нажатии и границы
			changeColumnWidth: function (col, x2, mouseX) {
				var t = this;

				x2 *= asc_getcvt( 0/*px*/, 1/*pt*/, t._getPPIX() );
				// Учитываем координаты точки, где мы начали изменение размера
				x2 += mouseX;

				var offsetX = t.cols[t.visibleRange.c1].left - t.cellsLeft;
				var x1 = t.cols[col].left - offsetX - this.width_1px;
				var w = Math.max(x2 - x1 - this.width_1px, 0);
				var cc = Math.min(t._colWidthToCharCount(w), /*max col width*/255);
				var cw = t._charCountToModelColWidth(cc, true, /*noPad*/true);

				var onChangeWidthCallback = function (isSuccess) {
					if (false === isSuccess)
						return;

					t.model.setColWidth(cw, col, col);
					t._cleanCache(asc_Range(0, 0, t.cols.length - 1, t.rows.length - 1));
					t.changeWorksheet("update");
					t._updateVisibleColsCount();
				};
				return this._isLockedAll (onChangeWidthCallback);
			},

			// mouseY - это разница стартовых координат от мыши при нажатии и границы
			changeRowHeight: function (row, y2, mouseY) {
				var t = this;

				y2 *= asc_getcvt( 0/*px*/, 1/*pt*/, t._getPPIY() );
				// Учитываем координаты точки, где мы начали изменение размера
				y2 += mouseY;

				var offsetY = t.rows[t.visibleRange.r1].top - t.cellsTop;
				var y1 = t.rows[row].top - offsetY - this.height_1px;

				var onChangeHeightCallback = function (isSuccess) {
					if (false === isSuccess)
						return;

					t.model.setRowHeight(Math.min(t.maxRowHeight, Math.max(y2 - y1 + t.height_1px, 0)), row, row);
					t._cleanCache(asc_Range(0, row, t.cols.length - 1, row));
					t.changeWorksheet("update");
					t._updateVisibleRowsCount();
				};
				return this._isLockedAll (onChangeHeightCallback);
			},


			// Проверяет, есть ли числовые значения в диапазоне
			_hasNumberValueInActiveRange: function() {
				var cell, cellType, isNumberFormat;
				var mergedRange = this._getMergedCellsRange(this.activeRange.c1, this.activeRange.r1);
				var result = null;

				if (this._rangeIsSingleCell(this.activeRange) || mergedRange && mergedRange.isEqual(this.activeRange)) {
					// Для одной ячейки не стоит ничего делать
					return result;
				}

				for (var c = this.activeRange.c1; c <= this.activeRange.c2; ++c) {
					for (var r = this.activeRange.r1; r <= this.activeRange.r2; ++r) {
						cell = this._getCellTextCache(c, r);
						if (cell) {
							// Нашли не пустую ячейку, проверим формат
							cellType = cell.cellType;
							isNumberFormat = (null == cellType || CellValueType.Number === cellType);
							if (isNumberFormat) {
								if (null === result) {
									result = {};
									result.arrCols = [];
									result.arrRows = [];
								}
								result.arrCols.push(c);
								result.arrRows.push(r);
							}
						}
					}
				}
				if (null !== result) {
					function cmpNum(a, b) {return a - b;}
					// Делаем массивы уникальными и сортируем
					$.unique(result.arrCols);
					$.unique(result.arrRows);
					result.arrCols = result.arrCols.sort(cmpNum);
					result.arrRows = result.arrRows.sort(cmpNum);
				}
				return result;
			},

			// Автодополняет формулу диапазоном, если это возможно
			autoCompletFormula: function (functionName) {
				var t = this;
				this.activeRange.normalize();
				var ar = this.activeRange;
				var arCopy = null;
				var arHistorySelect = ar.clone(true);
				var vr = this.visibleRange;

				// Первая верхняя не числовая ячейка
				var topCell = null;
				// Первая левая не числовая ячейка
				var leftCell = null;

				var r = ar.startRow - 1;
				var c = ar.startCol - 1;
				var cell, cellType, isNumberFormat;
				var result = {};
				// Проверим, есть ли числовые значения в диапазоне
				var hasNumber = this._hasNumberValueInActiveRange();
				var val, text;

				if (hasNumber) {
					var i;
					// Есть ли значения в последней строке и столбце
					var hasNumberInLastColumn = (ar.c2 === hasNumber.arrCols[hasNumber.arrCols.length - 1]);
					var hasNumberInLastRow = (ar.r2 === hasNumber.arrRows[hasNumber.arrRows.length - 1]);

					// Нужно уменьшить зону выделения (если она реально уменьшилась)
					var startCol = hasNumber.arrCols[0];
					var startRow = hasNumber.arrRows[0];
					// Старые границы диапазона
					var startColOld = ar.c1;
					var startRowOld = ar.r1;
					// Нужно ли перерисовывать
					var bIsUpdate = false;
					if (startColOld !== startCol || startRowOld !== startRow) {
						bIsUpdate = true;
					}
					if (true === hasNumberInLastRow && true === hasNumberInLastColumn) {
						bIsUpdate = true;
					}
					if (bIsUpdate) {
						this.cleanSelection();
						ar.c1 = startCol;
						ar.r1 = startRow;
						if (false === ar.contains(ar.startCol, ar.startRow)) {
							// Передвинуть первую ячейку в выделении
							ar.startCol = startCol;
							ar.startRow = startRow;
						}
						if (true === hasNumberInLastRow && true === hasNumberInLastColumn) {
							// Мы расширяем диапазон
							if (1 === hasNumber.arrRows.length) {
								// Одна строка или только в последней строке есть значения... (увеличиваем вправо)
								ar.c2 += 1;
							} else {
								// Иначе вводим в строку вниз
								ar.r2 += 1;
							}
						}
						this._drawSelection();
					}

					arCopy = ar.clone(true);

					var functionAction = null;
					var changedRange = null;

					if (false === hasNumberInLastColumn && false === hasNumberInLastRow) {
						// Значений нет ни в последней строке ни в последнем столбце (значит нужно сделать формулы в каждой последней ячейке)
						changedRange = [new asc_Range(hasNumber.arrCols[0], arCopy.r2,
							hasNumber.arrCols[hasNumber.arrCols.length - 1], arCopy.r2), new asc_Range(arCopy.c2,
							hasNumber.arrRows[0], arCopy.c2, hasNumber.arrRows[hasNumber.arrRows.length - 1])];
						functionAction = function () {
							// Пройдемся по последней строке
							for (i = 0; i < hasNumber.arrCols.length; ++i) {
								c = hasNumber.arrCols[i];
								cell = t._getVisibleCell(c, arCopy.r2);
								text = t._getCellTitle (c, arCopy.r1) + ":" + t._getCellTitle (c, arCopy.r2 - 1);
								val = "=" + functionName + "(" + text + ")";
								// ToDo - при вводе формулы в заголовок автофильтра надо писать "0"
								cell.setValue(val);
							}
							// Пройдемся по последнему столбцу
							for (i = 0; i < hasNumber.arrRows.length; ++i) {
								r = hasNumber.arrRows[i];
								cell = t._getVisibleCell(arCopy.c2, r);
								text = t._getCellTitle (arCopy.c1, r) + ":" + t._getCellTitle (arCopy.c2 - 1, r);
								val = "=" + functionName + "(" + text + ")";
								cell.setValue(val);
							}
							// Значение в правой нижней ячейке
							cell = t._getVisibleCell(arCopy.c2, arCopy.r2);
							text = t._getCellTitle (arCopy.c1, arCopy.r2) + ":" + t._getCellTitle (arCopy.c2 - 1, arCopy.r2);
							val = "=" + functionName + "(" + text + ")";
							cell.setValue(val);
						};
					} else if (true === hasNumberInLastRow && false === hasNumberInLastColumn) {
						// Есть значения только в последней строке (значит нужно заполнить только последнюю колонку)
						changedRange = new asc_Range(arCopy.c2, hasNumber.arrRows[0],
							arCopy.c2, hasNumber.arrRows[hasNumber.arrRows.length - 1]);
						functionAction = function () {
							// Пройдемся по последнему столбцу
							for (i = 0; i < hasNumber.arrRows.length; ++i) {
								r = hasNumber.arrRows[i];
								cell = t._getVisibleCell(arCopy.c2, r);
								text = t._getCellTitle (arCopy.c1, r) + ":" + t._getCellTitle (arCopy.c2 - 1, r);
								val = "=" + functionName + "(" + text + ")";
								cell.setValue(val);
							}
						};
					} else if (false === hasNumberInLastRow && true === hasNumberInLastColumn) {
						// Есть значения только в последнем столбце (значит нужно заполнить только последнюю строчку)
						changedRange = new asc_Range(hasNumber.arrCols[0], arCopy.r2,
							hasNumber.arrCols[hasNumber.arrCols.length - 1], arCopy.r2);
						functionAction = function () {
							// Пройдемся по последней строке
							for (i = 0; i < hasNumber.arrCols.length; ++i) {
								c = hasNumber.arrCols[i];
								cell = t._getVisibleCell(c, arCopy.r2);
								text = t._getCellTitle (c, arCopy.r1) + ":" + t._getCellTitle (c, arCopy.r2 - 1);
								val = "=" + functionName + "(" + text + ")";
								cell.setValue(val);
							}
						};
					} else {
						// Есть значения и в последнем столбце, и в последней строке
						if (1 === hasNumber.arrRows.length) {
							changedRange = new asc_Range(arCopy.c2, arCopy.r2, arCopy.c2, arCopy.r2);
							functionAction = function () {
								// Одна строка или только в последней строке есть значения...
								cell = t._getVisibleCell(arCopy.c2, arCopy.r2);
								// ToDo вводить в первое свободное место, а не сразу за диапазоном
								text = t._getCellTitle (arCopy.c1, arCopy.r2) + ":" + t._getCellTitle (arCopy.c2 - 1, arCopy.r2);
								val = "=" + functionName + "(" + text + ")";
								cell.setValue(val);
							};
						} else {
							changedRange = new asc_Range(hasNumber.arrCols[0], arCopy.r2,
								hasNumber.arrCols[hasNumber.arrCols.length - 1], arCopy.r2);
							functionAction = function () {
								// Иначе вводим в строку вниз
								for (i = 0; i < hasNumber.arrCols.length; ++i) {
									c = hasNumber.arrCols[i];
									cell = t._getVisibleCell(c, arCopy.r2);
									// ToDo вводить в первое свободное место, а не сразу за диапазоном
									text = t._getCellTitle (c, arCopy.r1) + ":" + t._getCellTitle (c, arCopy.r2 - 1);
									val = "=" + functionName + "(" + text + ")";
									cell.setValue(val);
								}
							};
						}
					}

					var onAutoCompletFormula = function (isSuccess) {
						if (false === isSuccess)
							return;

						History.Create_NewPoint();
						History.SetSelection(arHistorySelect);
						History.StartTransaction();

						if ($.isFunction(functionAction)) {functionAction();}

						History.EndTransaction();
					};

					// Можно ли применять автоформулу
					this._isLockedCells (changedRange, /*subType*/null, onAutoCompletFormula);

					result.notEditCell = true;
					return result;
				}

				// Ищем первую ячейку с числом
				for (; r >= vr.r1; --r) {
					cell = this._getCellTextCache(ar.startCol, r);
					if (cell) {
						// Нашли не пустую ячейку, проверим формат
						cellType = cell.cellType;
						isNumberFormat = (null === cellType || CellValueType.Number === cellType);
						if (isNumberFormat) {
							// Это число, мы нашли то, что искали
							topCell = asc_clone(cell);
							topCell.r = r;
							topCell.c = ar.startCol;
							// смотрим вторую ячейку
							if (topCell.isFormula && r-1 >= vr.r1) {
								cell = this._getCellTextCache(ar.startCol, r-1);
								if (cell && cell.isFormula) {
									topCell.isFormulaSeq = true;
								}
							}
							break;
						}
					}
				}
				// Проверим, первой все равно должна быть колонка
				if (null === topCell || topCell.r !== ar.startRow - 1 || topCell.isFormula && !topCell.isFormulaSeq) {
					for (; c >= vr.c1; --c) {
						cell = this._getCellTextCache(c, ar.startRow);
						if (cell) {
							// Нашли не пустую ячейку, проверим формат
							cellType = cell.cellType;
							isNumberFormat = (null === cellType || CellValueType.Number === cellType);
							if (isNumberFormat) {
								// Это число, мы нашли то, что искали
								leftCell = asc_clone(cell);
								leftCell.r = ar.startRow;
								leftCell.c = c;
								break;
							}
						}
						if (null !== topCell) {
							// Если это не первая ячейка слева от текущей и мы нашли верхнюю, то дальше не стоит искать
							break;
						}
					}
				}

				if (leftCell) {
					// Идем влево до первой не числовой ячейки
					--c;
					for (; c >= 0; --c) {
						cell = this._getCellTextCache(c, ar.startRow);
						if (!cell) {
							// Могут быть еще не закешированные данные
							this._addCellTextToCache (c, ar.startRow);
							cell = this._getCellTextCache (c, ar.startRow);
							if (!cell)
								break;
						}
						cellType = cell.cellType;
						isNumberFormat = (null === cellType || CellValueType.Number === cellType);
						if (!isNumberFormat)
							break;
					}
					// Мы ушли чуть дальше
					++c;
					// Диапазон или только 1 ячейка
					if (ar.startCol - 1 !== c) {
						// Диапазон
						result = asc_Range(c, leftCell.r, ar.startCol - 1, leftCell.r);
					} else {
						// Одна ячейка
						result = asc_Range(c, leftCell.r, c, leftCell.r);
					}
					result.type = c_oAscSelectionType.RangeCells;
					this._fixSelectionOfMergedCells(result);
					result.normalize();
					if (result.c1 === result.c2 && result.r1 === result.r2)
						result.text = this._getCellTitle (result.c1, result.r1);
					else
						result.text = this._getCellTitle (result.c1, result.r1) + ":" + this._getCellTitle (result.c2, result.r2);
					return result;
				}

				if (topCell) {
					// Идем вверх до первой не числовой ячейки
					--r;
					for (; r >= 0; --r) {
						cell = this._getCellTextCache(ar.startCol, r);
						if (!cell) {
							// Могут быть еще не закешированные данные
							this._addCellTextToCache (ar.startCol, r);
							cell = this._getCellTextCache (ar.startCol, r);
							if (!cell)
								break;
						}
						cellType = cell.cellType;
						isNumberFormat = (null === cellType || CellValueType.Number === cellType);
						if (!isNumberFormat)
							break;
					}
					// Мы ушли чуть дальше
					++r;
					// Диапазон или только 1 ячейка
					if (ar.startRow - 1 !== r) {
						// Диапазон
						result = asc_Range(topCell.c, r, topCell.c, ar.startRow - 1);
					} else {
						// Одна ячейка
						result = asc_Range(topCell.c, r, topCell.c, r);
					}
					result.type = c_oAscSelectionType.RangeCells;
					this._fixSelectionOfMergedCells(result);
					result.normalize();
					if (result.c1 === result.c2 && result.r1 === result.r2)
						result.text = this._getCellTitle(result.c1, result.r1);
					else
						result.text = this._getCellTitle(result.c1, result.r1) + ":" + this._getCellTitle(result.c2, result.r2);
					return result;
				}
			},

			// ToDo переделать на полную отрисовку на нашем контексте
			getDrawingContextCharts: function () {
				return this._trigger("getDCForCharts");
			},


			// ----- Initialization -----

			_init: function () {
				this._initWorksheetDefaultWidth();
				this._initCellsArea(true);
				this.autoFilters.addFiltersAfterOpen(this);
				this._initConditionalFormatting();
				this._cleanCellsTextMetricsCache();
				this._prepareCellTextMetricsCache(this.visibleRange);
				// initializing is completed
				this._trigger("initialized");
			},
			_initConditionalFormatting: function () {
				var oGradient = null;
				var aCFs = this.model.aConditionalFormatting;
				var aRules, oRule;
				var oRuleElement = null;
				var min = Number.MAX_VALUE;
				var max = -Number.MAX_VALUE;
				var tmp;
				var arrayCells = [];
				for (var i in aCFs) {
					if (!aCFs.hasOwnProperty(i) )
						continue;
					aRules = aCFs[i].aRules;
					if (0 >= aRules.length)
						continue;
					for (var j in aRules) {
						if (!aRules.hasOwnProperty(j))
							continue;

						oRule = aRules[j];
						// ToDo aboveAverage, beginsWith, cellIs, containsBlanks, containsErrors,
						// ToDo containsText, dataBar, duplicateValues, endsWith, expression, iconSet, notContainsBlanks,
						// ToDo notContainsErrors, notContainsText, timePeriod, top10, uniqueValues (page 2679)
						switch (oRule.Type) {
							case "colorScale":
								if (1 !== oRule.aRuleElements.length)
									break;
								oRuleElement = oRule.aRuleElements[0];
								if (!(oRuleElement instanceof asc.CColorScale))
									break;
								aCFs[i].SqRefRange._setPropertyNoEmpty(null, null, function (c) {
									if (CellValueType.Number === c.getType() && false === c.isEmptyTextString()) {
										tmp = parseFloat(c.getValueWithoutFormat());
										if (isNaN(tmp))
											return;
										arrayCells.push({cell: c, val: tmp});
										min = Math.min(min, tmp);
										max = Math.max(max, tmp);
									}
								});

								// ToDo CFVO Type (formula, max, min, num, percent, percentile) (page 2681)
								// ToDo support 3 colors in rule
								if (0 < arrayCells.length && 2 === oRuleElement.aColors.length) {
									oGradient = new asc.CGradient(oRuleElement.aColors[0], oRuleElement.aColors[1]);
									oGradient.init(min, max);

									for (var cell in arrayCells) {
										if (arrayCells.hasOwnProperty(cell)) {
											var dxf = new CellXfs();
											dxf.fill = new Fill({bg:oGradient.calculateColor(arrayCells[cell].val)});
											arrayCells[cell].cell.setConditionalFormattingStyle(dxf);
										}
									}
								}

								arrayCells.splice(0, arrayCells.length);
								min = Number.MAX_VALUE;
								max = -Number.MAX_VALUE;
								break;
						}
					}
				}
			},
			_prepareComments: function () {
				var commentList = [];	// для отправки за один раз
				for(var i = 0, length = this.model.aComments.length;  i < length; ++i)
				{
					var comment = this.model.aComments[i];
					this.cellCommentator.addCommentSerialize(comment);
					commentList.push(comment);
				}
				if ( commentList.length )
					this.model.workbook.handlers.trigger("asc_onAddComments", commentList);
				
				//this.model.aComments = new Array();
				//this.model.aCommentsCoords = new Array();
			},
			_initWorksheetDefaultWidth: function () {
				this.nBaseColWidth = this.model.nBaseColWidth || this.nBaseColWidth;
				// Теперь рассчитываем число px
				var defaultColWidthChars = this._charCountToModelColWidth(this.nBaseColWidth);
				this.defaultColWidthPx = this._modelColWidthToColWidth(defaultColWidthChars) * asc_getcvt(1/*pt*/, 0/*px*/, 96);
				// Делаем кратным 8 (http://support.microsoft.com/kb/214123)
				this.defaultColWidthPx = asc_ceil(this.defaultColWidthPx / 8) * 8;
				this.defaultColWidthChars = this._colWidthToCharCount(this.defaultColWidthPx * asc_getcvt(0/*px*/, 1/*pt*/, 96));

				gc_dDefaultColWidthCharsAttribute = this._charCountToModelColWidth(this.defaultColWidthChars, true);
				this.defaultColWidth = this._modelColWidthToColWidth(gc_dDefaultColWidthCharsAttribute);

				// ToDo разобраться со значениями
				this.maxRowHeight = asc_calcnpt( 409, this._getPPIY() );
				this.defaultRowDescender = this._calcRowDescender(this.settings.cells.fontSize);
				this.defaultRowHeight = asc_calcnpt( this.settings.cells.fontSize * this.vspRatio, this._getPPIY() ) + this.height_1px;
			},
			_initCellsArea: function (fullRecalc) {
				this.width_1px = asc_calcnpt(0, this._getPPIX(), 1/*px*/);
				this.width_2px = asc_calcnpt(0, this._getPPIX(), 2/*px*/);
				this.width_3px = asc_calcnpt(0, this._getPPIX(), 3/*px*/);
				this.width_padding = asc_calcnpt(0, this._getPPIX(), this.settings.cells.padding/*px*/);
				this.height_1px = asc_calcnpt(0, this._getPPIY(), 1/*px*/);
				this.height_2px = asc_calcnpt(0, this._getPPIY(), 2/*px*/);
				this.height_3px = asc_calcnpt(0, this._getPPIY(), 3/*px*/);

				// calculate rows heights and visible rows
				this._calcHeaderRowHeight();
				this._calcRowHeights(fullRecalc ? 1 : 0);
				this.visibleRange.r2 = 0;
				this._calcVisibleRows();
				this._updateVisibleRowsCount(/*skipScrolReinit*/true);

				// calculate columns widths and visible columns
				this._calcHeaderColumnWidth();
				this._calcColumnWidths(fullRecalc ? 1 : 0);
				this.visibleRange.c2 = 0;
				this._calcVisibleColumns();
				this._updateVisibleColsCount(/*skipScrolReinit*/true);

				this._updateHyperlinksCache();
			},

			/**
			 * Вычисляет ширину столбца для заданного количества символов
			 * @param {Number} count  Количество символов
			 * @param {Boolean} displayWidth  При расчете использовать целое число пикселов
			 * @param {Boolean} noPad  При расчете не учитывать отступ 5px в ячейке
			 * @returns {Number}      Ширина столбца в символах
			 */
			_charCountToModelColWidth: function (count, displayWidth, noPad) {
				if (count <= 0) { return 0; }
				var maxw = displayWidth ? asc_round(this.maxDigitWidth) : this.maxDigitWidth;
				return asc_floor( ( count * maxw + (!noPad ? 5 : 0) ) / maxw * 256 ) / 256;
			},

			/**
			 * Вычисляет ширину столбца в пунктах
			 * @param {Number} mcw  Количество символов
			 * @param {Boolean} displayWidth  При расчете использовать целое число пикселов
			 * @returns {Number}    Ширина столбца в пунктах (pt)
			 */
			_modelColWidthToColWidth: function (mcw, displayWidth) {
				var maxw = displayWidth ? asc_round(this.maxDigitWidth) : this.maxDigitWidth;
				var px = asc_floor( (( 256 * mcw + asc_floor(128 / maxw) ) / 256) * maxw );
				return px * asc_getcvt( 0/*px*/, 1/*pt*/, 96 );
			},

			/**
			 * Вычисляет количество символов по ширине столбца
			 * @param {Number} w  Ширина столбца в пунктах
			 * @returns {Number}  Количество символов
			 */
			_colWidthToCharCount: function (w) {
				var px = w * asc_getcvt( 1/*pt*/, 0/*px*/, 96 );
				return px <= 5 ? 0 : asc_floor( (px - 5) / asc_round(this.maxDigitWidth) * 100 + 0.5 ) / 100;
			},

			/**
			 * Вычисляет ширину столбца для отрисовки
			 * @param {Number} w  Ширина столбца в символах
			 * @returns {Number}  Ширина столбца в пунктах (pt)
			 */
			_calcColWidth: function (w) {
				var t = this;
				var res = {};
				var useDefault = w === undefined || w === null || w === -1;
				var width;
				res.width = useDefault ? t.defaultColWidth : (width = t._modelColWidthToColWidth(w), (width < t.width_1px ? 0 : width));
				res.innerWidth = Math.max(res.width - this.width_padding * 2 - this.width_1px, 0);
				res.charCount = t._colWidthToCharCount(res.width);
				return res;
			},

			/**
			 * Вычисляет Descender строки
			 * @param {Number} fontSize
			 * @returns {Number}
			 */
			_calcRowDescender: function (fontSize) {
				return asc_calcnpt(fontSize * (this.vspRatio - 1), this._getPPIY());
			},

			/** Вычисляет ширину колонки заголовков (в pt) */
			_calcHeaderColumnWidth: function () {
				if (false === this.model.sheetViews[0].asc_getShowRowColHeaders())
					this.headersWidth = 0;
				else {
					// Ширина колонки заголовков считается  - max число знаков в строке - перевести в символы - перевести в пикселы
					var numDigit = Math.max( calcDecades(this.visibleRange.r2 + 1), 3);
					var nCharCount = this._charCountToModelColWidth(numDigit);
					this.headersWidth = this._modelColWidthToColWidth(nCharCount);
				}

				//var w = this.emSize * Math.max( calcDecades(this.visibleRange.r2 + 1), 3) * 1.25;
				//this.headersWidth = asc_calcnpt(w, this._getPPIX());

				this.cellsLeft = this.headersLeft + this.headersWidth;
			},

			/** Вычисляет высоту строки заголовков (в pt) */
			_calcHeaderRowHeight: function () {
				if (false === this.model.sheetViews[0].asc_getShowRowColHeaders())
					this.headersHeight = 0;
				else
					this.headersHeight = this.model.getDefaultHeight() || this.defaultRowHeight;

				//this.headersHeight = asc_calcnpt( this.settings.header.fontSize * this.vspRatio, this._getPPIY() );
				this.cellsTop = this.headersTop + this.headersHeight;
			},

			/**
			 * Вычисляет ширину и позицию колонок (в pt)
			 * @param {Number} fullRecalc  0 - без пересчета; 1 - пересчитываем все; 2 - пересчитываем новые строки
			 */
			_calcColumnWidths: function (fullRecalc) {
				var x = this.cellsLeft;
				var visibleW = this.drawingCtx.getWidth();
				var obr = this.objectRender.getDrawingAreaMetrics() || {maxCol: 0, maxRow: 0};
				var l = Math.max(this.model.getColsCount(), this.nColsCount, obr.maxCol);
				var i = 0, w, column, isBestFit, hiddenW = 0;

				// Берем дефалтовую ширину документа
				var defaultWidth = this.model.getDefaultWidth();
				defaultWidth = (typeof defaultWidth === "number" && defaultWidth >= 0) ? defaultWidth : -1;

				if (1 === fullRecalc) {
					this.cols = [];
				}
				else if (2 === fullRecalc) {
					i = this.cols.length;
					x = this.cols[i - 1].left + this.cols[i - 1].width;
				}
				for (; ((0 !== fullRecalc) ? i < l || x + hiddenW < visibleW : i < this.cols.length) && i <= gc_nMaxCol0; ++i) {
					// Получаем свойства колонки
					column = this.model._getColNoEmptyWithAll(i);
					if (!column) {
						w = defaultWidth; // Используем дефолтное значение
						isBestFit = true; // Это уже оптимальная ширина
					} else if (column.hd) {
						w = 0;            // Если столбец скрытый, ширину выставляем 0
						isBestFit = false;
						hiddenW += this._calcColWidth(column.width).width;
					} else {
						w = column.width || defaultWidth;
						isBestFit = !!(column.BestFit || (null === column.BestFit && null === column.CustomWidth));
					}
					this.cols[i] = this._calcColWidth(w);
					this.cols[i].isCustomWidth = !isBestFit;
					this.cols[i].left = x;
					x += this.cols[i].width;
				}
			},

			/**
			 * Вычисляет высоту и позицию строк (в pt)
			 * @param {Number} fullRecalc  0 - без пересчета; 1 - пересчитываем все; 2 - пересчитываем новые строки
			 */
			_calcRowHeights: function (fullRecalc) {
				var y = this.cellsTop;
				var visibleH = this.drawingCtx.getHeight();
				var obr = this.objectRender.getDrawingAreaMetrics() || {maxCol: 0, maxRow: 0};
				var l = Math.max(this.model.getRowsCount() , this.nRowsCount, obr.maxRow);
				var defaultH = this.model.getDefaultHeight() || this.defaultRowHeight;
				var i = 0, h, isCustomHeight, row, hiddenH = 0;

				if (1 === fullRecalc) {
					this.rows = [];
				} else if (2 === fullRecalc) {
					i = this.rows.length;
					y = this.rows[i - 1].top + this.rows[i - 1].height;
				}
				for (; (0 !== fullRecalc) ? i < l || y + hiddenH < visibleH : i < this.rows.length; ++i) {
					row = this.model._getRowNoEmpty(i);
					if (!row) {
						h = -1; // Будет использоваться дефолтная высота строки
						isCustomHeight = false;
					} else if (row.hd) {
						h = 0;  // Скрытая строка, высоту выставляем 0
						isCustomHeight = true;
						hiddenH += row.h > 0 ? row.h - this.height_1px : defaultH;
					} else {
						isCustomHeight = !!row.CustomHeight;
						h = (row.h > 0 && isCustomHeight) ? row.h : -1; // Берем высоту из модели, если она custom(баг 15618), либо дефолтную
					}
					h = h < 0 ? defaultH : h;
					this.rows[i] = {
						top: y,
						height: h,
						descender: this.defaultRowDescender,
						isCustomHeight: isCustomHeight,
						isDefaultHeight: !(row && row.h > 0 && isCustomHeight)  // Высота строки, вычисленная на основе текста
					};
					y += this.rows[i].height;
				}
			},

			/** Вычисляет диапазон индексов видимых колонок */
			_calcVisibleColumns: function () {
				var l = this.cols.length;
				var w = this.drawingCtx.getWidth();
				var sumW = this.cellsLeft;
				for (var i = this.visibleRange.c1, f = false; i < l && sumW < w; ++i) {
					sumW += this.cols[i].width;
					f = true;
				}
				this.visibleRange.c2 = i - (f ? 1 : 0);
			},

			/** Вычисляет диапазон индексов видимых колонок */
			_calcVisibleRows: function () {
				var l = this.rows.length;
				var h = this.drawingCtx.getHeight();
				var sumH = this.cellsTop;
				for (var i = this.visibleRange.r1, f = false; i < l && sumH < h; ++i) {
					sumH += this.rows[i].height;
					f = true;
				}
				this.visibleRange.r2 = i - (f ? 1 : 0);
			},

			/** Обновляет позицию колонок (в pt) */
			_updateColumnPositions: function () {
				var x = this.cellsLeft;
				for (var l = this.cols.length, i = 0; i < l; ++i) {
					this.cols[i].left = x;
					x += this.cols[i].width;
				}
			},

			/** Обновляет позицию строк (в pt) */
			_updateRowPositions: function () {
				var y = this.cellsTop;
				for (var l = this.rows.length, i = 0; i < l; ++i) {
					this.rows[i].top = y;
					y += this.rows[i].height;
				}
			},

			/**
			 * Добавляет колонки, пока общая ширина листа не превысит rightSide
			 * @param {Number} rightSide Правая граница
			 */
			_appendColumns: function (rightSide) {
				var i = this.cols.length;
				var lc = this.cols[i - 1];
				var done = false;

				for (var x = lc.left + lc.width; x < rightSide || !done; ++i) {
					if (x >= rightSide) {
						// add +1 column at the end and exit cycle
						done = true;
					}
					this.cols[i] = this._calcColWidth( this.model.getColWidth(i) );
					this.cols[i].left = x;
					x += this.cols[i].width;
					this.isChanged = true;
				}
			},

			/** Устанаваливает видимый диапазон ячеек максимально возможным */
			_normalizeViewRange: function () {
				var t = this;
				var vr = t.visibleRange;
				var w = t.drawingCtx.getWidth() - t.cellsLeft;
				var h = t.drawingCtx.getHeight() - t.cellsTop;
				var c = t.cols;
				var r = t.rows;
				var vw = c[vr.c2].left + c[vr.c2].width - c[vr.c1].left;
				var vh = r[vr.r2].top + r[vr.r2].height - r[vr.r1].top;
				var i;

				if (vw < w) {
					for (i = vr.c1 - 1; i >= 0; --i) {
						vw += c[i].width;
						if (vw > w) {break;}
					}
					vr.c1 = i + 1;
					if (vr.c1 >= vr.c2) {vr.c1 = vr.c2 - 1;}
					if (vr.c1 < 0) {vr.c1 = 0;}
				}

				if (vh < h) {
					for (i = vr.r1 - 1; i >= 0; --i) {
						vh += r[i].height;
						if (vh > h) {break;}
					}
					vr.r1 = i + 1;
					if (vr.r1 >= vr.r2) {vr.r1 = vr.r2 - 1;}
					if (vr.r1 < 0) {vr.r1 = 0;}
				}
			},

			_shiftVisibleRange: function () {
				var t = this;
				var vr = t.visibleRange;
				var arn = t.activeRange.clone(true);
				var i;

				do {
					if (arn.r2 > vr.r2) {
						i = arn.r2 - vr.r2;
						vr.r1 += i;
						vr.r2 += i;
						t._calcVisibleRows();
						continue;
					}
					if (t._isRowDrawnPartially(arn.r2, vr.r1)) {
						vr.r1 += 1;
						t._calcVisibleRows();
					}
					if (arn.r1 < vr.r1) {
						i = arn.r1 - vr.r1;
						vr.r1 += i;
						vr.r2 += i;
						t._calcVisibleRows();
					}
					break;
				} while (1);

				do {
					if (arn.c2 > vr.c2) {
						i = arn.c2 - vr.c2;
						vr.c1 += i;
						vr.c2 += i;
						t._calcVisibleColumns();
						continue;
					}
					if (t._isColDrawnPartially(arn.c2, vr.c1)) {
						vr.c1 += 1;
						t._calcVisibleColumns();
					}
					if (arn.c1 < vr.c1) {
						i = arn.c1 - vr.c1;
						vr.c1 += i;
						vr.c2 += i;
						if (vr.c1 < 0) { vr.c1 = 0; vr.c2 -= vr.c1; }
						t._calcVisibleColumns();
					}
					break;
				} while (1);
			},

			// Обновляем cache hyperlinks
			_updateHyperlinksCache: function () {
				// ToDo можно обновлять не весь cache гиперлинков, а только часть
				var t = this;
				var vr = t.visibleRange;
				var range = t.model.getRange3(vr.r1, vr.c1, vr.r2, vr.c2);
				var hyperlinks = range.getHyperlinks ();
				this.visibleHyperlinks = [];
				if (null === hyperlinks)
					return;
				for (var i = 0; i < hyperlinks.length; ++i) {
					// Гиперлинк
					var oHyperlink = new asc_CHyperlink();
					// Range для гиперссылки
					var hyperlinkTmp = hyperlinks[i].hyperlink;
					var hyperlinkRange = hyperlinkTmp.Ref.getBBox0();
					oHyperlink.asc_setHyperlinkRange (hyperlinkRange);
					oHyperlink.asc_setHyperlinkCol (hyperlinks[i].col);
					oHyperlink.asc_setHyperlinkRow (hyperlinks[i].row);
					// Тип гиперссылки
					var type = (null !== hyperlinkTmp.Hyperlink) ? c_oAscHyperlinkType.WebLink : c_oAscHyperlinkType.RangeLink;
					oHyperlink.asc_setType (type);
					if (c_oAscHyperlinkType.RangeLink === type) {
						// // ToDo переделать это место (парсить должны в момент открытия и добавления ссылки)
						var result = parserHelp.parse3DRef (hyperlinkTmp.Location);
						if (null !== result) {
							oHyperlink.asc_setSheet (result.sheet);
							oHyperlink.asc_setRange (result.range);
						}
					}
					oHyperlink.asc_setLocation (hyperlinkTmp.Location);
					oHyperlink.asc_setTooltip (hyperlinkTmp.Tooltip);
					oHyperlink.asc_setHyperlinkUrl (hyperlinkTmp.Hyperlink);
					// Добавляем гиперссылку в кеш
					this.visibleHyperlinks[i] = oHyperlink;
				}
			},

			// Получаем индекс гиперлинка по ячейке
			_getHyperlinkIndex: function (c, r) {
				for (var i = this.visibleHyperlinks.length - 1; i >= 0; --i) {
					var col = this.visibleHyperlinks[i].asc_getHyperlinkCol();
					var row = this.visibleHyperlinks[i].asc_getHyperlinkRow();
					if (col === c && row === r)
						return i;
				}
				return null;
			},

			// ----- Drawing for print -----
			calcPagesPrint: function (pageOptions, printOnlySelection, indexWorksheet, layoutPageType) {
				var maxCols = this.model.getColsCount();
				var maxRows = this.model.getRowsCount();
				var lastC = -1, lastR = -1;
				var activeRange = printOnlySelection ? this.activeRange : null;

				if (null === activeRange) {
					for (var c = 0; c < maxCols; ++c) {
						for (var r = 0; r < maxRows; ++r) {
							if (!this._isCellEmptyOrMergedOrBackgroundColorOrBorders(c, r)) {
								var ct = this._getCellTextCache(c, r);
								if (ct === undefined) {
									// Мы печатаем и могут быть невидимые области, попробуем добавить текст и взять его снова
									this._addCellTextToCache (c, r);
									ct = this._getCellTextCache(c, r);
								}
								var rightSide = 0;
								if (ct !== undefined) {
									var isMerged = ct.flags.isMerged, isWrapped = ct.flags.wrapText;
									if (!isMerged && !isWrapped)
										rightSide = ct.sideR;
								}

								lastC = Math.max(lastC, c + rightSide);
								lastR = Math.max(lastR, r);
							}
						}
					}
					maxCols = lastC+1;
					maxRows = lastR+1;

					// Получаем максимальную колонку/строку для изображений/чатов
					var maxObjectsCoord = this.objectRender.getDrawingAreaMetrics();
					if (maxObjectsCoord) {
						maxCols = Math.max (maxCols, maxObjectsCoord.maxCol);
						maxRows = Math.max (maxRows, maxObjectsCoord.maxRow);
					}
				}
				else {
					maxCols = activeRange.c2 + 1;
					maxRows = activeRange.r2 + 1;
				}

				var pageMargins, pageSetup, pageGridLines, pageHeadings;
				if (pageOptions instanceof asc_CPageOptions) {
					pageMargins = pageOptions.asc_getPageMargins();
					pageSetup = pageOptions.asc_getPageSetup();
					pageGridLines = pageOptions.asc_getGridLines();
					pageHeadings = pageOptions.asc_getHeadings();
				}

				var pageWidth, pageHeight, pageOrientation;
				if (pageSetup instanceof asc_CPageSetup) {
					pageWidth = pageSetup.asc_getWidth();
					pageHeight = pageSetup.asc_getHeight();
					pageOrientation = pageSetup.asc_getOrientation();
				}

				var pageLeftField, pageRightField, pageTopField, pageBottomField;
				if (pageMargins instanceof asc_CPageMargins) {
					pageLeftField = pageMargins.asc_getLeft();
					pageRightField = pageMargins.asc_getRight();
					pageTopField = pageMargins.asc_getTop();
					pageBottomField = pageMargins.asc_getBottom();
				}

				if (null === pageGridLines || undefined === pageGridLines) { pageGridLines = c_oAscPrintDefaultSettings.PageGridLines; }
				if (null === pageHeadings || undefined === pageHeadings) { pageHeadings = c_oAscPrintDefaultSettings.PageHeadings; }

				if (null === pageWidth || undefined === pageWidth) { pageWidth = c_oAscPrintDefaultSettings.PageWidth; }
				if (null === pageHeight || undefined === pageHeight) { pageHeight = c_oAscPrintDefaultSettings.PageHeight; }
				if (null === pageOrientation || undefined === pageOrientation) { pageOrientation = c_oAscPrintDefaultSettings.PageOrientation; }

				if (null === pageLeftField || undefined === pageLeftField) { pageLeftField = c_oAscPrintDefaultSettings.PageLeftField; }
				if (null === pageRightField || undefined === pageRightField) { pageRightField = c_oAscPrintDefaultSettings.PageRightField; }
				if (null === pageTopField || undefined === pageTopField) { pageTopField = c_oAscPrintDefaultSettings.PageTopField; }
				if (null === pageBottomField || undefined === pageBottomField) { pageBottomField = c_oAscPrintDefaultSettings.PageBottomField; }

				if (c_oAscPageOrientation.PageLandscape === pageOrientation) {
					var tmp = pageWidth;
					pageWidth = pageHeight;
					pageHeight = tmp;
				}

				var arrResult = [];
				if (0 === maxCols || 0 === maxRows) {
					// Ничего нет, возвращаем пустой массив
					return null;
				} else {
					var pageWidthWithFields = pageWidth - pageLeftField - pageRightField;
					var pageHeightWithFields = pageHeight - pageTopField - pageBottomField;
					var leftFieldInPt = pageLeftField / vector_koef;
					var topFieldInPt = pageTopField / vector_koef;
					var rightFieldInPt = pageRightField / vector_koef;
					var bottomFieldInPt = pageBottomField / vector_koef;

					if (pageHeadings) {
						// Рисуем заголовки, нужно чуть сдвинуться
						leftFieldInPt += this.cellsLeft;
						topFieldInPt += this.cellsTop;
					}

					var pageWidthWithFieldsHeadings = (pageWidth - pageRightField) / vector_koef - leftFieldInPt;
					var pageHeightWithFieldsHeadings = (pageHeight - pageBottomField) / vector_koef - topFieldInPt;

					var currentColIndex = (null !== activeRange) ? activeRange.c1 : 0;
					var currentWidth = 0;
					var currentRowIndex = (null !== activeRange) ? activeRange.r1 : 0;
					var currentHeight = 0;
					var isCalcColumnsWidth = true;

					var bIsAddOffset = false;
					var nCountOffset = 0;

					while (true) {
						if (currentColIndex === maxCols && currentRowIndex === maxRows)
							break;

						var newPagePrint = new asc_CPagePrint();

						var colIndex = currentColIndex, rowIndex = currentRowIndex;

						newPagePrint.indexWorksheet = indexWorksheet;

						newPagePrint.pageWidth = pageWidth;
						newPagePrint.pageHeight = pageHeight;
						newPagePrint.pageClipRectLeft = pageLeftField / vector_koef;
						newPagePrint.pageClipRectTop = pageTopField / vector_koef;
						newPagePrint.pageClipRectWidth = pageWidthWithFields / vector_koef;
						newPagePrint.pageClipRectHeight = pageHeightWithFields / vector_koef;

						newPagePrint.leftFieldInPt = leftFieldInPt;
						newPagePrint.topFieldInPt = topFieldInPt;
						newPagePrint.rightFieldInPt = rightFieldInPt;
						newPagePrint.bottomFieldInPt = bottomFieldInPt;

						for (rowIndex = currentRowIndex; rowIndex < maxRows; ++rowIndex) {
							var currentRowHeight = this.rows[rowIndex].height;
							if (currentHeight + currentRowHeight > pageHeightWithFieldsHeadings) {
								// Закончили рисовать страницу
								break;
							}
							if (isCalcColumnsWidth) {
								for (colIndex = currentColIndex; colIndex < maxCols; ++colIndex) {
									var currentColWidth = this.cols[colIndex].width;
									if (bIsAddOffset) {
										newPagePrint.startOffset = ++nCountOffset;
										newPagePrint.startOffsetPt = (pageWidthWithFieldsHeadings * newPagePrint.startOffset);
										currentColWidth -= newPagePrint.startOffsetPt;
									}

									if (c_oAscLayoutPageType.FitToWidth !== layoutPageType && currentWidth + currentColWidth > pageWidthWithFieldsHeadings && colIndex !== currentColIndex)
										break;

									currentWidth += currentColWidth;

									if (c_oAscLayoutPageType.FitToWidth !== layoutPageType && currentWidth > pageWidthWithFieldsHeadings && colIndex === currentColIndex) {
										// Смещаем в селедующий раз ячейку
										bIsAddOffset = true;
										++colIndex;
										break;
									}
									else
										bIsAddOffset = false;
								}
								isCalcColumnsWidth = false;
								if (pageHeadings) {
									currentWidth += this.cellsLeft;
								}

								if (c_oAscLayoutPageType.FitToWidth === layoutPageType) {
									newPagePrint.pageClipRectWidth = Math.max(currentWidth, newPagePrint.pageClipRectWidth);
									newPagePrint.pageWidth = newPagePrint.pageClipRectWidth * vector_koef + (pageLeftField + pageRightField);
								} else {
									newPagePrint.pageClipRectWidth = Math.min(currentWidth, newPagePrint.pageClipRectWidth);
								}
							}

							currentHeight += currentRowHeight;
							currentWidth = 0;
						}

						// Нужно будет пересчитывать колонки
						isCalcColumnsWidth = true;

						// Рисуем сетку
						if (pageGridLines) {
							newPagePrint.pageGridLines = true;
						}

						if (pageHeadings) {
							// Нужно отрисовать заголовки
							newPagePrint.pageHeadings = true;
						}

						newPagePrint.pageRange = asc_Range(currentColIndex, currentRowIndex, colIndex - 1, rowIndex - 1);

						if (bIsAddOffset) {
							// Мы еще не дорисовали колонку
							colIndex -= 1;
						} else {
							nCountOffset = 0;
						}

						if (colIndex < maxCols) {
							// Мы еще не все колонки отрисовали
							currentColIndex = colIndex;
							currentHeight = 0;
						}
						else {
							// Мы дорисовали все колонки, нужна новая строка и стартовая колонка
							currentColIndex = (null !== activeRange) ? activeRange.c1 : 0;
							currentRowIndex = rowIndex;
							currentHeight = 0;
						}

						if (rowIndex === maxRows) {
							// Мы вышли, т.к. дошли до конца отрисовки по строкам
							if (colIndex < maxCols) {
								currentColIndex = colIndex;
								currentHeight = 0;
							}
							else {
								// Мы дошли до конца отрисовки
								currentColIndex = colIndex;
								currentRowIndex = rowIndex;
							}
						}

						arrResult.push(newPagePrint);
					}
				}

				return arrResult;
			},
			drawForPrint: function (drawingCtx, printPagesData) {
                var isAppBridge = (undefined != window['appBridge']);

				if (null === printPagesData) {
					// Напечатаем пустую страницу
					drawingCtx.BeginPage (c_oAscPrintDefaultSettings.PageWidth, c_oAscPrintDefaultSettings.PageHeight);
					drawingCtx.EndPage();
				} else {
					drawingCtx.BeginPage (printPagesData.pageWidth, printPagesData.pageHeight);
					drawingCtx.AddClipRect (printPagesData.pageClipRectLeft, printPagesData.pageClipRectTop, printPagesData.pageClipRectWidth, printPagesData.pageClipRectHeight);

                    if (isAppBridge) {window['appBridge']['dummyCommandUpdate'] ();}

                    var offsetCols = printPagesData.startOffsetPt;

					var range = printPagesData.pageRange;
					for (var row = range.r1; row <= range.r2; ++row) {
						var rangeTmpRow = asc_Range(range.c1, row, range.c2, row);

                        if (isAppBridge) {window['appBridge']['dummyCommandUpdate'] ();}

						// Рисуем сетку
						if (printPagesData.pageGridLines) {
							this._drawGrid(drawingCtx, rangeTmpRow, this.cols[range.c1].left - printPagesData.leftFieldInPt + offsetCols, this.rows[range.r1].top - printPagesData.topFieldInPt, printPagesData.pageWidth / vector_koef, printPagesData.pageHeight / vector_koef);
						}

                        if (isAppBridge) {window['appBridge']['dummyCommandUpdate'] ();}

                        // Рисуем строку для печати
						var mergedCells = {};
						$.extend (mergedCells,
							this._drawRowBG(drawingCtx, row, range.c1, range.c2, this.cols[range.c1].left - printPagesData.leftFieldInPt + offsetCols, this.rows[range.r1].top - printPagesData.topFieldInPt, false),
							this._drawRowText(drawingCtx, row, range.c1, range.c2, this.cols[range.c1].left - printPagesData.leftFieldInPt + offsetCols, this.rows[range.r1].top - printPagesData.topFieldInPt));

                        if (isAppBridge) {window['appBridge']['dummyCommandUpdate'] ();}

                        // draw merged cells at last stage to fix cells background issue
						for (var i in mergedCells) if (mergedCells.hasOwnProperty(i)) {
							var mc = mergedCells[i];
							this._drawRowBG(drawingCtx, mc.row, mc.col, mc.col, this.cols[range.c1].left - printPagesData.leftFieldInPt + offsetCols, this.rows[range.r1].top - printPagesData.topFieldInPt, true);
							this._drawCellText(drawingCtx, mc.col, mc.row, range.c1, range.c2, this.cols[range.c1].left - printPagesData.leftFieldInPt + offsetCols, this.rows[range.r1].top - printPagesData.topFieldInPt, true);

                            if (isAppBridge) {window['appBridge']['dummyCommandUpdate'] ();}
                        }

                        if (isAppBridge) {window['appBridge']['dummyCommandUpdate'] ();}

                        // Отрисовываем бордеры
						this._drawCellsBorders (drawingCtx, range, /*mergedCellsStage*/undefined, this.cols[range.c1].left - printPagesData.leftFieldInPt + offsetCols, this.rows[range.r1].top - printPagesData.topFieldInPt);

                        if (isAppBridge) {window['appBridge']['dummyCommandUpdate'] ();}
                    }

					if (printPagesData.pageHeadings) {
						// Нужно отрисовать заголовки
						this._drawColumnHeaders (drawingCtx, range.c1, range.c2, /*style*/ undefined, this.cols[range.c1].left - printPagesData.leftFieldInPt + offsetCols, printPagesData.topFieldInPt - this.cellsTop);
						this._drawRowHeaders (drawingCtx, range.r1, range.r2, /*style*/ undefined, printPagesData.leftFieldInPt - this.cellsLeft, this.rows[range.r1].top - printPagesData.topFieldInPt);
					}

                    if (isAppBridge) {window['appBridge']['dummyCommandUpdate'] ();}

                    // Отрисовываем картинки и графики (для этого должны выставить видимую область)
					// Сохраняем копию и на время меняем область (стоит рисовать от входных параметров функции, а не от методов класса)
					var tmpVisibleRange = this.visibleRange.clone(true);
					this.visibleRange.c1 = range.c1;
					this.visibleRange.c2 = range.c2;
					this.visibleRange.r1 = range.r1;
					this.visibleRange.r2 = range.r2;

					var drawingPrintOptions = {
						ctx: drawingCtx,
						margin: {
							left: printPagesData.leftFieldInPt - this.cellsLeft,
							top: printPagesData.topFieldInPt - this.cellsTop,
							right: printPagesData.rightFieldInPt,
							bottom: printPagesData.bottomFieldInPt
						}
					};
					this.objectRender.showDrawingObjects(false, drawingPrintOptions, false);
					this.visibleRange = tmpVisibleRange.clone(true);

                    if (isAppBridge) {window['appBridge']['dummyCommandUpdate'] ();}

                    drawingCtx.RemoveClipRect();
					drawingCtx.EndPage();
				}
			},

			// ----- Drawing -----

			draw: function (lockDraw) {
				if( lockDraw ) return this;
				this._clean();
				this._drawCorner();
				this._drawColumnHeaders(/*drawingCtx*/ undefined);
				this._drawRowHeaders(/*drawingCtx*/ undefined);
				this._drawGrid(/*drawingCtx*/ undefined);
				this._drawCells();
				this._drawCellsBorders(/*drawingCtx*/undefined);
				this._fixSelectionOfMergedCells();
				this._fixSelectionOfHiddenCells(undefined, undefined, /*isDraw*/true);
				if (this.overlayCtx) {
					this._drawSelection();
				}
				//draw auto filters
				this.autoFilters.drawAutoF(this);
				this.objectRender.showDrawingObjects(false, null/*printOptions*/, true/*bUpdateCharts*/);
				this.cellCommentator.drawCommentCells(false);

				return this;
			},

			_clean: function () {
				this.drawingCtx
						.setFillStyle(this.settings.cells.defaultState.background)
						.fillRect(0, 0, this.drawingCtx.getWidth(), this.drawingCtx.getHeight());
				if (this.overlayCtx) {
					this.overlayCtx.clear();
				}
			},

			drawHighlightedHeaders: function (col, row) {
				this._activateOverlayCtx();
				if (col >= 0 && col !== this.highlightedCol) {
					this._doCleanHighlightedHeaders();
					this.highlightedCol = col;
					this._drawColumnHeaders(/*drawingCtx*/ undefined, col, col, kHeaderHighlighted);
				} else if (row >= 0 && row !== this.highlightedRow) {
					this._doCleanHighlightedHeaders();
					this.highlightedRow = row;
					this._drawRowHeaders(/*drawingCtx*/ undefined, row, row, kHeaderHighlighted);
				}
				this._deactivateOverlayCtx();
				return this;
			},

			cleanHighlightedHeaders: function () {
				this._activateOverlayCtx();
				this._doCleanHighlightedHeaders();
				this._deactivateOverlayCtx();
				return this;
			},

			_activateOverlayCtx: function () {
				this.drawingCtx = this.buffers.overlay;
			},

			_deactivateOverlayCtx: function () {
				this.drawingCtx = this.buffers.main;
			},

			_doCleanHighlightedHeaders: function () {
				var hlc = this.highlightedCol,
				hlr = this.highlightedRow,
				arn = this.activeRange.clone(true);
				if (hlc >= 0) {
					if (hlc >= arn.c1 && hlc <= arn.c2) {
						this._drawColumnHeaders(/*drawingCtx*/ undefined, hlc, hlc, kHeaderActive);
					} else {
						this._cleanColumnHeaders(hlc);
						if (hlc + 1 === arn.c1) {
							this._drawColumnHeaders(/*drawingCtx*/ undefined, hlc + 1, hlc + 1, kHeaderActive);
						} else if (hlc - 1 === arn.c2) {
							this._drawColumnHeaders(/*drawingCtx*/ undefined, hlc - 1, hlc - 1, kHeaderActive);
						}
					}
					this.highlightedCol = -1;
				}
				if (hlr >= 0) {
					if (hlr >= arn.r1 && hlr <= arn.r2) {
						this._drawRowHeaders(/*drawingCtx*/ undefined, hlr, hlr, kHeaderActive);
					} else {
						this._cleanRowHeades(hlr);
						if (hlr + 1 === arn.r1) {
							this._drawRowHeaders(/*drawingCtx*/ undefined, hlr + 1, hlr + 1, kHeaderActive);
						} else if (hlr - 1 === arn.r2) {
							this._drawRowHeaders(/*drawingCtx*/ undefined, hlr - 1, hlr - 1, kHeaderActive);
						}
					}
					this.highlightedRow = -1;
				}
			},

			_drawActiveHeaders: function () {
				var arn = this.activeRange.clone(true),
				vr = this.visibleRange,
				c1 = Math.max(vr.c1, arn.c1),
				c2 = Math.min(vr.c2, arn.c2),
				r1 = Math.max(vr.r1, arn.r1),
				r2 = Math.min(vr.r2, arn.r2);
				this._activateOverlayCtx();
				this._drawColumnHeaders(/*drawingCtx*/ undefined, c1, c2, kHeaderActive);
				this._drawRowHeaders(/*drawingCtx*/ undefined, r1, r2, kHeaderActive);
				this._deactivateOverlayCtx();
			},

			_drawCorner: function () {
				if (false === this.model.sheetViews[0].asc_getShowRowColHeaders())
					return;
				var x1 = this.headersLeft + this.headersWidth - this.headersHeight;
				var x2 = this.headersLeft + this.headersWidth;
				var y1 = this.headersTop;
				var y2 = this.headersTop + this.headersHeight;
				var dx = 3;
				var dy = 2;

				this._drawHeader(/*drawingCtx*/ undefined, "",
						this.headersLeft, this.headersTop, this.headersWidth, this.headersHeight,
						kHeaderDefault, true, -1);
				this.drawingCtx
						.beginPath()
						.moveTo(x2, y1, -dx-1.5, dy)
						.lineTo(x2, y2, -dx-1.5, -dy-1)
						.lineTo(x2, y2, -dx-1, -dy-1.5)
						.lineTo(x1, y2, 0, -dy-1.5)
						.lineTo(x1, y2, 0.5, -dy-1.5)
						.lineTo(x2, y1, -dx-1.5, dy+0.5)
						.lineTo(x2, y1, -dx-1.5, dy)
						.setFillPattern(this.settings.header.cornerColor)
						.fill();
			},

			/** Рисует заголовки видимых колонок */
			_drawColumnHeaders: function (drawingCtx, start, end, style, offsetXForDraw, offsetYForDraw) {
				if (undefined === drawingCtx && false === this.model.sheetViews[0].asc_getShowRowColHeaders())
					return;
				var hdr = this.settings.header;
				var cells = this.settings.cells;
				var vr  = this.visibleRange;
				var offsetX = (offsetXForDraw) ? offsetXForDraw : this.cols[vr.c1].left - this.cellsLeft;
				var offsetY = (offsetYForDraw) ? offsetYForDraw : this.headersTop;

				if (asc_typeof(start) !== "number") {start = vr.c1;}
				if (asc_typeof(end) !== "number") {end = vr.c2;}
				if (style === undefined) {style = kHeaderDefault;}

				this._setFont(drawingCtx, hdr.fontName, hdr.fontSize);
				this.stringRender.setDefaultFont(new asc_FP(hdr.fontName, hdr.fontSize));

				// draw column headers
				for (var i = start; i <= end; ++i) {
					this._drawHeader(drawingCtx, this._getColumnTitle(i),
						this.cols[i].left - offsetX, offsetY, this.cols[i].width, this.headersHeight,
						style, true, i);
				}

				this.stringRender.setDefaultFont(new asc_FP(cells.fontName, cells.fontSize));
			},

			/** Рисует заголовки видимых строк */
			_drawRowHeaders: function (drawingCtx, start, end, style, offsetXForDraw, offsetYForDraw) {
				if (undefined === drawingCtx && false === this.model.sheetViews[0].asc_getShowRowColHeaders())
					return;
				var hdr = this.settings.header;
				var cells = this.settings.cells;
				var vr  = this.visibleRange;
				var offsetX = (offsetXForDraw) ? offsetXForDraw : this.headersLeft;
				var offsetY = (offsetYForDraw) ? offsetYForDraw : this.rows[vr.r1].top - this.cellsTop;

				if (asc_typeof(start) !== "number") {start = vr.r1;}
				if (asc_typeof(end) !== "number") {end = vr.r2;}
				if (style === undefined) {style = kHeaderDefault;}

				this._setFont(drawingCtx, hdr.fontName, hdr.fontSize);
				this.stringRender.setDefaultFont(new asc_FP(hdr.fontName, hdr.fontSize));

				// draw row headers
				for (var i = start; i <= end; ++i) {
					this._drawHeader(drawingCtx, this._getRowTitle(i),
						offsetX, this.rows[i].top - offsetY, this.headersWidth, this.rows[i].height,
						style, false, i);
				}

				this.stringRender.setDefaultFont(new asc_FP(cells.fontName, cells.fontSize));
			},

			/**
			* Рисует заголовок, принимает координаты и размеры в pt
			* @param {DrawingContext} drawingCtx
			* @param {String} text  Текст заголовка
			* @param {Number} x  Координата левого угла в pt
			* @param {Number} y  Координата левого угла в pt
			* @param {Number} w  Ширина в pt
			* @param {Number} h  Высота в pt
			* @param {Number} style  Стиль заголовка (kHeaderDefault, kHeaderActive, kHeaderHighlighted, kHeaderSelected)
			* @param {Boolean} isColHeader  Тип заголовка: true - колонка, false - строка
			* @param {Number} index  Индекс столбца/строки или -1
			*/
			_drawHeader: function (drawingCtx, text, x, y, w, h, style, isColHeader, index) {
				// Для отрисовки невидимого столбца/строки
				var isZeroHeader = false;
				if (isColHeader) {
					if (w < this.width_1px) {
						// Это невидимый столбец
						isZeroHeader = true;
						// Отрисуем только границу
						w = this.width_1px;
						// Возможно мы уже рисовали границу невидимого столбца (для последовательности невидимых)
						if (0 < index && 0 === this.cols[index - 1].width) {
							// Мы уже нарисовали border для невидимой границы
							return;
						}
					}
					else if (0 < index && 0 === this.cols[index - 1].width) {
						// Мы уже нарисовали border для невидимой границы (поэтому нужно чуть меньше рисовать для соседнего столбца)
						w -= this.width_1px;
						x += this.width_1px;
					}
				}
				else {
					if (h < this.height_1px) {
						// Это невидимая строка
						isZeroHeader = true;
						// Отрисуем только границу
						h = this.height_1px;
						// Возможно мы уже рисовали границу невидимой строки (для последовательности невидимых)
						if (0 < index && 0 === this.rows[index - 1].height) {
							// Мы уже нарисовали border для невидимой границы
							return;
						}
					}
					else if (0 < index && 0 === this.rows[index - 1].height) {
						// Мы уже нарисовали border для невидимой границы (поэтому нужно чуть меньше рисовать для соседней строки)
						h -= this.height_1px;
						y += this.height_1px;
					}
				}

				var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
				var st = this.settings.header.style[style];
				var x2 = x + w - this.width_1px;
				var y2 = y + h - this.height_1px;

				// background только для видимых
				if (!isZeroHeader) {
				// draw background
				ctx.setFillStyle(st.background)
						.fillRect(x, y, w, h);
				}
				// draw border
				ctx.setStrokeStyle(st.border)
						.setLineWidth(1)
						.beginPath();
				if (/*style !== kHeaderDefault &&*/ !isColHeader) {
					ctx.moveTo(x, y, 0, -0.5)
							.lineTo(x2, y, 1, -0.5);
				}
				ctx.moveTo(x2, y, 0.5, 0)
						.lineTo(x2, y2, 0.5, 0)
						.moveTo(x2, y2, 1, 0.5)
						.lineTo(x, y2, 0, 0.5);
				if (/*style !== kHeaderDefault &&*/ isColHeader) {
					ctx.moveTo(x, y2, -0.5, 1)
							.lineTo(x, y, -0.5, 0);
				}
				ctx.stroke();

				// Для невидимых кроме border-а ничего не рисуем
				if (isZeroHeader || text.length < 1)
					return;

				// draw text
				var sr    = this.stringRender;
				var tm    = this._roundTextMetrics( sr.measureString(text) );
				var bl    = y2 - (isColHeader ? this.defaultRowDescender : this.rows[index].descender);
				var textX = this._calcTextHorizPos(x, x2, tm, tm.width < w ? khaCenter : khaLeft);
				var textY = this._calcTextVertPos(y, y2, bl, tm, kvaBottom);
				if (drawingCtx) {
					ctx.AddClipRect(x, y, w, h);
					ctx.setFillStyle(st.color)
						.fillText(text, textX, textY + tm.baseline, undefined, sr.charWidths);
					ctx.RemoveClipRect();
				}
				else {
					ctx.save()
							.beginPath()
							.rect(x, y, w, h)
							.clip()
							.setFillStyle(st.color)
							.fillText(text, textX, textY + tm.baseline, undefined, sr.charWidths)
							.restore();
				}
			},

			_cleanColumnHeaders: function (colStart, colEnd) {
				var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
				if (colEnd === undefined) {colEnd = colStart;}
				for (var i = colStart; i <= colEnd; ++i) {
					this.drawingCtx.clearRect(
						this.cols[i].left - offsetX - this.width_1px, this.headersTop,
						this.cols[i].width + this.width_1px, this.headersHeight);
				}
			},

			_cleanRowHeades: function (rowStart, rowEnd) {
				var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
				if (rowEnd === undefined) {rowEnd = rowStart;}
				for (var i = rowStart; i <= rowEnd; ++i) {
					this.drawingCtx.clearRect(
						this.headersLeft, this.rows[i].top - offsetY - this.height_1px,
						this.headersWidth, this.rows[i].height + this.height_1px);
				}
			},

			_cleanColumnHeadersRect: function () {
					this.drawingCtx.clearRect(
						this.cellsLeft, this.headersTop,
						this.drawingCtx.getWidth() - this.cellsLeft, this.headersHeight);
			},

			/** Рисует сетку таблицы */
			_drawGrid: function (drawingCtx, range, leftFieldInPt, topFieldInPt, width, height) {
				// Возможно сетку не нужно рисовать (при печати свои проверки)
				if (undefined === drawingCtx && false === this.model.sheetViews[0].asc_getShowGridLines())
					return;

				if (range === undefined) {
					range = this.visibleRange;
				}
				var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
				var widthCtx = (width) ? width : ctx.getWidth();
				var heightCtx = (height) ? height : ctx.getHeight();
				var offsetX = (leftFieldInPt) ? leftFieldInPt : this.cols[this.visibleRange.c1].left - this.cellsLeft;
				var offsetY = (topFieldInPt) ? topFieldInPt : this.rows[this.visibleRange.r1].top - this.cellsTop;
				var x1  = this.cols[range.c1].left - offsetX;
				var y1  = this.rows[range.r1].top - offsetY;
				var x2  = Math.min(this.cols[range.c2].left - offsetX + this.cols[range.c2].width, widthCtx);
				var y2  = Math.min(this.rows[range.r2].top - offsetY + this.rows[range.r2].height, heightCtx);
				ctx.setFillStyle(this.settings.cells.defaultState.background)
						.fillRect(x1, y1, x2 - x1, y2 - y1)
						.setStrokeStyle(this.settings.cells.defaultState.border)
						.setLineWidth(1);
				for (var i = range.c1, x = x1; i <= range.c2 && x <= x2; ++i) {
					x += this.cols[i].width;
					ctx.beginPath().moveTo(x, y1, -0.5, 0).lineTo(x, y2, -0.5, 0).stroke();
				}
				for (var j = range.r1, y = y1; j <= range.r2 && y <= y2; ++j) {
					y += this.rows[j].height;
					ctx.beginPath().moveTo(x1, y, 0, -0.5).lineTo(x2, y, 0, -0.5).stroke();
				}
			},

			/** Рисует ячейки таблицы */
			_drawCells: function (range) {
				if (range === undefined) {
					range = this.visibleRange;
				}

				this._prepareCellTextMetricsCache(range);

				var ctx  = this.drawingCtx;
				var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
				var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
				var mergedCells = {}, mc, i;
				// set clipping rect to cells area
				ctx.save()
						.beginPath()
						.rect(this.cellsLeft, this.cellsTop, ctx.getWidth() - this.cellsLeft, ctx.getHeight() - this.cellsTop)
						.clip();
				for (var row = range.r1; row <= range.r2; ++row) {
					$.extend( mergedCells,
					          this._drawRowBG(/*drawingCtx*/undefined, row, range.c1, range.c2, offsetX, offsetY, false),
					          this._drawRowText(/*drawingCtx*/undefined, row, range.c1, range.c2, offsetX, offsetY) );
				}
				// draw merged cells at last stage to fix cells background issue
				for (i in mergedCells) if (mergedCells.hasOwnProperty(i)) {
					mc = mergedCells[i];
					this._drawRowBG(/*drawingCtx*/undefined, mc.row, mc.col, mc.col, offsetX, offsetY, true);
					this._drawCellText(/*drawingCtx*/undefined, mc.col, mc.row, range.c1, range.c2, offsetX, offsetY, true);
				}
				// restore canvas' original clipping range
				ctx.restore();
			},

			/** Рисует фон ячеек в строке */
			_drawRowBG: function (drawingCtx, row, colStart, colEnd, offsetX, offsetY, drawMergedCells) {
				if (this.rows[row].height < this.height_1px && true !== drawMergedCells) {return {};}

				for (var mergedCells = {}, col = colStart; col <= colEnd; ++col) {
					if (this.cols[col].width < this.width_1px && true !== drawMergedCells) {continue;}

					var c = this._getVisibleCell(col, row);
					if (!c) {continue;}

					var ctx = (undefined === drawingCtx) ? this.drawingCtx : drawingCtx;
					var bg = c.getFill();
					if(null != bg)
						bg = bg.getRgb();
					var fl = this._getCellFlags(c);
					var range = fl.isMerged ? this._getMergedCellsRange(col, row) : undefined;
					var mwidth = 0, mheight = 0;

					if (fl.isMerged && !drawMergedCells) {
						if (this._getCellTextCache(col, row, true) === undefined) {
							if (!range) {
								// Мы еще не закешировали замерженную ячейку, добавим и возьмем снова
								this._addMergedCellsRange (col, row);
								range = this._getMergedCellsRange(col, row);
							}
							mergedCells[range.r1 + "_" + range.c1] = {col: range.c1, row: range.r1};
						}
						continue;
					}

					if (fl.isMerged) {
						if (col !== range.c1 || row !== range.r1) {continue;}
						for (var i = range.c1 + 1; i <= range.c2 && i < this.nColsCount; ++i) {mwidth += this.cols[i].width;}
						for (var j = range.r1 + 1; j <= range.r2 && j < this.nRowsCount; ++j) {mheight += this.rows[j].height;}
					} else {
						if (bg === null) {
							if (col === colEnd && col < this.cols.length - 1 && row < this.rows.length - 1) {
								var c2 = this._getVisibleCell(col + 1, row);
								if (c2) {
									var bg2 = c2.getFill();
									if (bg2 !== null) {
										ctx.setFillStyle(asc_n2css(bg2.getRgb()))
												.fillRect(
														this.cols[col + 1].left - offsetX - this.width_1px,
														this.rows[row].top - offsetY - this.height_1px,
														this.width_1px,
														this.rows[row].height + this.height_1px);
									}
								}
								var c3 = this._getVisibleCell(col, row + 1);
								if (c3) {
									var bg3 = c3.getFill();
									if (bg3 !== null) {
										ctx.setFillStyle(asc_n2css(bg3.getRgb()))
												.fillRect(
														this.cols[col].left - offsetX - this.width_1px,
														this.rows[row + 1].top - offsetY - this.height_1px,
														this.cols[col].width + this.width_1px,
														this.height_1px);
									}
								}
							}
							continue;
						}
					}

					var x = this.cols[col].left - (bg !== null ? this.width_1px : 0);
					var y = this.rows[row].top - (bg !== null ? this.height_1px : 0);
					var w = this.cols[col].width + this.width_1px * (bg !== null ? +1 : -1) + mwidth;
					var h = this.rows[row].height + this.height_1px * (bg !== null ? +1 : -1) + mheight;
					var color = bg !== null ? asc_n2css(bg) : this.settings.cells.defaultState.background;
					ctx.setFillStyle(color)
							.fillRect(x - offsetX, y - offsetY, w, h);
				}
				return mergedCells;
			},

			/** Рисует текст ячеек в строке */
			_drawRowText: function (drawingCtx, row, colStart, colEnd, offsetX, offsetY) {
				if (this.rows[row].height < this.height_1px) {return {};}

				var dependentCells = {}, mergedCells = {}, i = undefined, mc;
				// draw cells' text
				for (var col = colStart; col <= colEnd; ++col) {
					if (this.cols[col].width < this.width_1px) {continue;}
					mc = this._drawCellText(drawingCtx, col, row, colStart, colEnd, offsetX, offsetY, false);
					if (mc !== null) {mergedCells[mc.index] = {col: mc.col, row: mc.row};}
					// check if long text overlaps this cell
					i = this._findSourceOfCellText(col, row);
						if (i >= 0) {
							dependentCells[i] = (dependentCells[i] || []);
							dependentCells[i].push(col);
						}
				}
				// draw long text that overlaps own cell's borders
				for (i in dependentCells) if (dependentCells.hasOwnProperty(i)) {
					var arr = dependentCells[i], j = arr.length - 1;
					col = parseInt(i, 10);
					// if source cell belongs to cells range then skip it (text has been drawn already)
					if (col >= arr[0] && col <= arr[j]) {continue;}
					// draw long text fragment
					this._drawCellText(drawingCtx, col, row, arr[0], arr[j], offsetX, offsetY, false);
				}
				return mergedCells;
			},

            /** Рисует текст ячейки */
            _drawCellText: function (drawingCtx, col, row, colStart, colEnd, offsetX, offsetY, drawMergedCells) {
                var ct = this._getCellTextCache(col, row);
                if (ct === undefined) {
                    if (drawingCtx) {
                        // Мы печатаем и могут быть невидимые области, попробуем добавить текст и взять его снова
                        this._addCellTextToCache (col, row);
                        ct = this._getCellTextCache(col, row);
                        if (ct === undefined)
                            return null;
                    }
                    else
                        return null;
                }

                var isMerged = ct.flags.isMerged, range = undefined, isWrapped = ct.flags.wrapText;
                var ctx = (undefined === drawingCtx) ? this.drawingCtx : drawingCtx;

                if (isMerged) {
                    range = this._getMergedCellsRange(col, row);
                    if (!drawMergedCells) {return {col: range.c1, row: range.r1, index: range.r1 + "_" + range.c1};}
                    if (col !== range.c1 || row !== range.r1) {return null;}
                }

                var colL = isMerged ? range.c1 : Math.max(colStart, col - ct.sideL);
                var colR = isMerged ? Math.min(range.c2, this.nColsCount - 1) : Math.min(colEnd, col + ct.sideR);
                var rowT = isMerged ? range.r1 : row;
                var rowB = isMerged ? Math.min(range.r2, this.nRowsCount - 1) : row;
                var isTrimmedR = !isMerged && colR !== col + ct.sideR;

                if (!(ct.angle || 0)) {
                    if (!isMerged && !isWrapped) {
                        this._eraseCellRightBorder(drawingCtx, colL, colR + (isTrimmedR ? 1 : 0), row, offsetX, offsetY);
                    }
                }

                var x1 = this.cols[colL].left - offsetX;
                var y1 = this.rows[rowT].top - offsetY;
                var w  = this.cols[colR].left + this.cols[colR].width - offsetX - x1;
                var h  = this.rows[rowB].top + this.rows[rowB].height - offsetY - y1;
                var x2 = x1 + w - (isTrimmedR ? 0 : this.width_1px);
                var y2 = y1 + h - this.height_1px;
                var bl = !isMerged ? (y2 - this.rows[rowB].descender) : (y2 - ct.metrics.height + ct.metrics.baseline);
                var x1ct  = isMerged ? x1 : this.cols[col].left - offsetX;
                var x2ct  = isMerged ? x2 : x1ct + this.cols[col].width - this.width_1px;
                var textX = this._calcTextHorizPos(x1ct, x2ct, ct.metrics, ct.cellHA);
                var textY = this._calcTextVertPos(y1, y2, bl, ct.metrics, ct.cellVA);
                var textW = this._calcTextWidth(x1ct, x2ct, ct.metrics, ct.cellHA);

                // TODO : все в отдельный метод
                var xb1, yb1, wb, hb, bound, colLeft, colRight;

                if (drawingCtx) {
                    if (ct.angle || 0) {

                        xb1 = this.cols[col].left - offsetX;
                        yb1 = this.rows[row].top - offsetY;
                        wb = this.cols[col].width;
                        hb = this.rows[row].height;

                        bound = this.stringRender.
                            getTransformBound(ct.angle, xb1, yb1, wb, hb, textW, ct.cellHA, ct.cellVA);

                        if (90 === ct.angle || -90 === ct.angle) {
                            ctx.AddClipRect (xb1, yb1, wb, hb);                              // клип по ячейке
                        } else {
                            ctx.AddClipRect (0, yb1, this.drawingCtx.getWidth(), h);        // клип по строке

                            if (!isMerged && !isWrapped) {
                                colLeft = col;
                                if (0 !== bound.sx) {
                                    while (true) {
                                        if (0 == colLeft) break;
                                        if (bound.sx > this.cols[colLeft].left) break;
                                        --colLeft;
                                    }
                                }

                                colRight = Math.min(col, this.nColsCount - 1);
                                if (0 !== bound.sw) {
                                    while (true) {
                                        ++colRight;
                                        if (colRight >= this.nColsCount) { --colRight; break; }
                                        if (bound.sw <= this.cols[colRight].left) { --colRight; break; }
                                    }
                                }

                                colLeft = isMerged ? range.c1 : colLeft;
                                colRight = isMerged ? Math.min(range.c2, this.nColsCount - 1) : colRight;

                                this._eraseCellRightBorder(
                                    drawingCtx, colLeft, colRight + (isTrimmedR ? 1 : 0), row,  offsetX, offsetY);
                            }
                        }

                        this.stringRender.
                            setRotatationAt(drawingCtx, ct.angle, xb1, yb1);

                        this.stringRender
                            .restoreInternalState(ct.state)
                            .renderForPrint(drawingCtx, 0, 0, textW, ct.color);
                        this.stringRender.resetTransform(drawingCtx);
                    } else {
                        ctx.AddClipRect (x1, y1, w, h);

                        this.stringRender
                            .restoreInternalState(ct.state)
                            .renderForPrint(drawingCtx, textX, textY, textW, ct.color);
                    }
                    ctx.RemoveClipRect();
                } else {
                    if (ct.angle || 0) {

                        xb1 = this.cols[col].left - offsetX;
                        yb1 = this.rows[row].top - offsetY;
                        wb = this.cols[col].width;
                        hb = this.rows[row].height;

                        bound = this.stringRender.
                            getTransformBound(ct.angle, xb1, yb1, wb, hb, textW, ct.cellHA, ct.cellVA);

                        if (90 === ct.angle || -90 === ct.angle) {

                            // клип по ячейке

                            ctx.save()
                                .beginPath()
                                .rect(xb1, yb1, wb, hb)
                                .clip();
                        } else {

                            // клип по строке

                            ctx.save()
                                .beginPath()
                                .rect(0, y1, this.drawingCtx.getWidth(), h)
                                .clip();

                            if (!isMerged && !isWrapped) {
                                colLeft = col;
                                if (0 !== bound.sx) {
                                    while (true) {
                                        if (0 == colLeft) break;
                                        if (bound.sx > this.cols[colLeft].left) break;
                                        --colLeft;
                                    }
                                }

                                colRight = Math.min(col, this.nColsCount - 1);
                                if (0 !== bound.sw) {
                                    while (true) {
                                        ++colRight;
                                        if (colRight >= this.nColsCount) { --colRight; break; }
                                        if (bound.sw <= this.cols[colRight].left) { --colRight; break; }
                                    }
                                }

                                colLeft = isMerged ? range.c1 : colLeft;
                                colRight = isMerged ? Math.min(range.c2, this.nColsCount - 1) : colRight;

                                this._eraseCellRightBorder(
                                    drawingCtx, colLeft, colRight + (isTrimmedR ? 1 : 0), row,  offsetX, offsetY);
                            }
                        }

                        this.stringRender.
                            setRotatationAt(undefined, ct.angle, xb1, yb1);

                        this.stringRender
                            .restoreInternalState(ct.state)
                            .render(0, 0, textW, ct.color);

                        ctx.restore();

                        // ctx
                        //     //.setFillStyle("#fcd")
                        //     //.fillRect(textX, textY, ct.metrics.width, ct.metrics.height);
                        //     .restore();

                        this.stringRender.resetTransform(undefined);
                    } else {

                        ctx.save()
                            .beginPath()
                            .rect(x1, y1, w, h)
                            .clip();

                        this.stringRender
                            .restoreInternalState(ct.state)
                            .render(textX, textY, textW, ct.color);

                        ctx
                            //     //.setFillStyle("#fcd")
                            //     //.fillRect(textX, textY, ct.metrics.width, ct.metrics.height);
                            .restore();
                    }
                }

                return null;
            },

			/** Удаляет вертикальные границы ячейки, если текст выходит за границы и соседние ячейки пусты */
			_eraseCellRightBorder: function (drawingCtx, colBeg, colEnd, row, offsetX, offsetY) {
				if (colBeg >= colEnd) {return;}
				var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
				ctx.setFillStyle(this.settings.cells.defaultState.background);
				for (var col = colBeg; col < colEnd; ++col) {
					var c = this._getCell(col, row);
					var bg = c !== undefined ? c.getFill() : null;
					if (bg !== null) {continue;}
					ctx.fillRect(
							this.cols[col].left + this.cols[col].width - offsetX - this.width_1px,
							this.rows[row].top - offsetY,
							this.width_1px,
							this.rows[row].height - this.height_1px);
				}
			},

			/** Рисует рамки для ячеек */
			_drawCellsBorders: function (drawingCtx, range, mergedCellsStage, leftFieldInPt, topFieldInPt) {
				//TODO: использовать стили линий при рисовании границ
				if (range === undefined) {
					range = this.visibleRange;
				}
				var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
				var offsetX = (leftFieldInPt) ? leftFieldInPt : this.cols[this.visibleRange.c1].left - this.cellsLeft;
				var offsetY = (topFieldInPt) ? topFieldInPt : this.rows[this.visibleRange.r1].top - this.cellsTop;
				var bc    = undefined; // cached border color
				var color = undefined; // cached border color string

				function drawBorderLine(border, x1, y1, x2, y2, fdx, fdy) {
					if (border.s !== kcbNone && !border.isErased) {
						if (bc !== border.c) {
							bc = border.c;
							color = asc_n2css(bc);
							ctx.setStrokeStyle(color);
						}
						ctx.setLineWidth(border.w)
								.beginPath()
								.moveTo(x1, y1, fdx(1), fdy(1))
								.lineTo(x2, y2, fdx(2), fdy(2))
								.stroke();
					}
				}

				// set clipping rect to cells area
				if (!drawingCtx) {
					ctx.save()
							.beginPath()
							.rect(this.cellsLeft, this.cellsTop, ctx.getWidth() - this.cellsLeft, ctx.getHeight() - this.cellsTop)
							.clip();
				}

				for (var row = range.r1; row <= range.r2 && row < this.nRowsCount; ++row) {
					var isFirstRow = row === range.r1,
					isLastRow  = row === range.r2,
					y1 = this.rows[row].top - offsetY,
					y2 = y1 + this.rows[row].height - this.height_1px,
					mc = undefined;

					for (var isMerged = false, col = range.c1; col <= range.c2 && col < this.nColsCount; ++col, isMerged = false) {
						var isFirstCol = col === range.c1;

						if (!mergedCellsStage) {
							mc = this._getMergedCellsRange(col, row);
							if (mc) {
								if ((col === mc.c1 || isFirstCol) && (row === mc.r1 || isFirstRow)) {
									this._drawCellsBorders(drawingCtx, mc, true, leftFieldInPt, topFieldInPt);
								}
								isMerged = true;
								col = mc.c2;
								// Проверка на выход за границы
								if (col >= this.nColsCount)
									col = this.nColsCount - 1;
							}
						}

						var x1 = this.cols[col].left - offsetX;
						var x2 = x1 + this.cols[col].width - this.width_1px;
						//
						var dd = this._getActiveBorder(col, row, kcbidDiagonalDown);
						var du = this._getActiveBorder(col, row, kcbidDiagonalUp);
						//
						var lb     = isFirstCol ? this._getActiveBorder(col, row, kcbidLeft) : rb;
						var lbPrev = isFirstCol ? this._getActiveBorder(col, row - 1, kcbidLeft) : rbPrev;
						var lbNext = isFirstCol ? this._getActiveBorder(col, row + 1, kcbidLeft) : rbNext;
						var tbPrev = isFirstCol ? this._getActiveBorder(col - 1, row, kcbidTop) : tb;
						var bbPrev = isFirstCol ? this._getActiveBorder(col - 1, row, kcbidBottom) : bb;
						var tb     = isFirstCol ? this._getActiveBorder(col, row, kcbidTop) : tbNext;
						var bb     = isFirstCol ? this._getActiveBorder(col, row, kcbidBottom) : bbNext;
						//
						var rb     = this._getActiveBorder(col, row, kcbidRight);
						var rbPrev = this._getActiveBorder(col, row - 1, kcbidRight);
						var rbNext = this._getActiveBorder(col, row + 1, kcbidRight);
						var tbNext = this._getActiveBorder(col + 1, row, kcbidTop);
						var bbNext = this._getActiveBorder(col + 1, row, kcbidBottom);

						if (isMerged || mergedCellsStage &&
						    row !== range.r1 && row !== range.r2&& col !== range.c1 && col !== range.c2) {continue;}

						var hasDD = dd.w > 0 && dd.s !== kcbNone;
						var hasDU = du.w > 0 && du.s !== kcbNone;
						if ( (hasDD || hasDU) && (!mergedCellsStage || row === range.r1 && col === range.c1) ) {
							ctx.save()
									.beginPath()
									.rect(x1 + this.width_1px * (lb.w < 1 ? -1 : (lb.w < 3 ? 0 : +1)),
									      y1 + this.width_1px * (tb.w < 1 ? -1 : (tb.w < 3 ? 0 : +1)),
									      this.cols[col].width + this.width_1px * ( -1 + (lb.w < 1 ? +1 : (lb.w < 3 ? 0 : -1)) + (rb.w < 1 ? +1 : (rb.w < 2 ? 0 : -1)) ),
									      this.rows[row].height + this.height_1px * ( -1 + (tb.w < 1 ? +1 : (tb.w < 3 ? 0 : -1)) + (bb.w < 1 ? +1 : (bb.w < 2 ? 0 : -1)) ))
									.clip();
							if (hasDD) {
								// draw diagonal line l,t - r,b
								drawBorderLine(dd, x1, y1, x2, y2,
								               function (point) {return point === 1 ? -0.5 : 0.5;},
								               function (point) {return point === 1 ? -0.5 : 0.5;});
							}
							if (hasDU) {
								// draw diagonal line l,b - r,t
								drawBorderLine(du, x1, y2, x2, y1,
								               function (point) {return point === 1 ? -0.5 : 0.5;},
								               function (point) {return point === 1 ? 0.5 : -0.5;});
							}
							ctx.restore();
							// canvas context has just been restored, so destroy border color cache
							bc = undefined;
						}

						function drawVerticalBorder(bor, isLeft, tb1, tb2, bb1, bb2, x1, y1, x2, y2) {
							if (bor.w < 1 || bor.isErased) {return;}

							var tbw = this._calcMaxBorderWidth(tb1, tb2); // top border width
							var bbw = this._calcMaxBorderWidth(bb1, bb2); // bottom border width
							var dy1 = tbw > bor.w ? tbw - 1 : (tbw > 1 ? -1 : 0);
							var dy2 = bbw > bor.w ? -2 : (bbw > 2 ? 1 : 0);
							drawBorderLine(bor, x1, y1, x2, y2,
							               function (point){return isLeft ? (bor.w !== 2 ? -0.5 : -1) : (bor.w !== 2 ? 0.5 : 0);},
							               function (point){return point === 1 ? -1 + dy1 : 1 + dy2;});
						}

						function drawHorizontalBorderCorner(bor, isTop, borOther, vb, isLeft, vbOther, x, y) {
							if (vbOther.w <= vb.w || vbOther.w < bor.w) {return;}

							var borw = Math.max(bor.w, borOther.w);
							drawBorderLine(vbOther, x, y, x, y,
							               function (point){return isLeft ? (vbOther.w !== 2 ? -0.5 : -1) : (vbOther.w !== 2 ? 0.5 : 0);},
							               function (point){return (point === 1 ? (borw > 1 ? -1 : 0) : (borw < 3 ? 1 : 2)) + (isTop ? -1 : 0);});
						}

						function drawHorizontalBorder(bor, isTop, borPrev, borNext, drawCorners, lb, lbOther, rb, rbOther, x1, y1, x2, y2) {
							if (bor.w > 0) {
								var lbw = this._calcMaxBorderWidth(lb, lbOther);
								var rbw = this._calcMaxBorderWidth(rb, rbOther);
								var dx1 = bor.w > lbw ? (lbw > 1 ? -1 : 0) : (lbw > 2 ? 2 : 1);
								var dx2 = bor.w > rbw ? (rbw > 2 ? 1 : 0) : (rbw > 1 ? -2 : -1);
								drawBorderLine(bor, x1, y1, x2, y2,
								               function (point){return point === 1 ? -1 + dx1 : 1 + dx2;},
								               function (point){return isTop ? (bor.w !== 2 ? -0.5 : -1) : (bor.w !== 2 ? 0.5 : 0);});
							}
							if (drawCorners) {
								if (isFirstCol) {
									// draw left corner
									drawHorizontalBorderCorner.call(this, bor, isTop, borPrev, lb, true, lbOther, x1, y1);
								}
								// draw right corner
								drawHorizontalBorderCorner.call(this, bor, isTop, borNext, rb, false, rbOther, x2, y2);
							}
						}

						if (isFirstCol) {
							// draw left border
							drawVerticalBorder.call(this, lb, true, tb, tbPrev, bb, bbPrev, x1, y1, x1, y2);
							// Если мы в печати и печатаем первый столбец, то нужно напечатать бордеры
							if (lb.w >= 1 && false == lb.isErased && drawingCtx && 0 === col) {
								// Иначе они будут не такой ширины
								drawVerticalBorder.call(this, lb, false, tb, tbPrev, bb, bbPrev, x1, y1, x1, y2);
							}
						}
						if (!mergedCellsStage || col === range.c2) {
							// draw right border
							drawVerticalBorder.call(this, rb, false, tb, tbNext, bb, bbNext, x2, y1, x2, y2);
						}

						if (isFirstRow) {
							// draw top border
							drawHorizontalBorder.call(this, tb, true, tbPrev, tbNext, true, lb, lbPrev, rb, rbPrev, x1, y1, x2, y1);
							// Если мы в печати и печатаем первую строку, то нужно напечатать бордеры
							if (tb.w > 0 && drawingCtx && 0 === row) {
								// Иначе они будут не такой ширины
								var tmpFirstCol = isFirstCol;
								isFirstCol = false;
								drawHorizontalBorder.call(this, tb, false, tbPrev, tbNext, true, lb, lbPrev, rb, rbPrev, x1, y1, x2, y1);
								//drawHorizontalBorder.call(this, emptyCellBorder, false, emptyCellBorder, tb, true, emptyCellBorder, emptyCellBorder, emptyCellBorder, rb, x1, y1, x2, y1);
								isFirstCol = tmpFirstCol;
							}
						}
						if (!mergedCellsStage || row === range.r2) {
							// draw bottom border
							drawHorizontalBorder.call(this, bb, false, bbPrev, bbNext, isLastRow, lb, lbNext, rb, rbNext, x1, y2, x2, y2);
						}
					}
				}

				if (!drawingCtx) {
					ctx.restore();
				}
			},

			/**
			 * Рисует выделение вокруг ячеек
			 * @param {Asc.Range} range
			 */
			_drawSelection: function (range) {
				if (!this.isSelectDialogRangeMode) {
					this._drawCollaborativeElements(/*bIsDrawObjects*/true);
					this._drawSelectionRange(range);
					this.cellCommentator.drawCommentCells(false);
				} else {
					this._drawSelectionRange(range);
				}
			},

			_drawSelectionRange: function (range) {
				if (c_oAscSelectionType.RangeMax === this.activeRange.type) {
					this.activeRange.c2 = this.cols.length - 1;
					this.activeRange.r2 = this.rows.length - 1;
				} else if (c_oAscSelectionType.RangeCol === this.activeRange.type) {
					this.activeRange.r2 = this.rows.length - 1;
				} else if (c_oAscSelectionType.RangeRow === this.activeRange.type) {
					this.activeRange.c2 = this.cols.length - 1;
				}

				if (!this.isSelectDialogRangeMode)
					range = this.activeRange.intersection(range !== undefined ? range : this.visibleRange);
				else
					range = this.copyOfActiveRange.intersection(range !== undefined ? range : this.visibleRange);

				// Copy fill Handle
				var aFH = null;
				// Вхождение range
				var aFHIntersection = null;
				if (this.activeFillHandle !== null) {
					// Мы в режиме автозаполнения
					aFH = this.activeFillHandle.clone(true);
					aFHIntersection = this.activeFillHandle.intersection(this.visibleRange);
				}

				if (!range && !aFHIntersection && !this.isFormulaEditMode && !this.activeMoveRange && !this.isChartAreaEditMode) {
					this._drawActiveHeaders();
					return;
				}

				var ctx = this.overlayCtx;
				var opt = this.settings;
				var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
				var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
				var arn = (!this.isSelectDialogRangeMode) ? this.activeRange.clone(true) : this.copyOfActiveRange.clone(true);
				var x1 = (range) ? (this.cols[range.c1].left - offsetX) : 0;
				var x2 = (range) ? (this.cols[range.c2].left + this.cols[range.c2].width - offsetX) : 0;
				var y1 = (range) ? (this.rows[range.r1].top - offsetY) : 0;
				var y2 = (range) ? (this.rows[range.r2].top + this.rows[range.r2].height - offsetY) : 0;
				var drawLeftSide   = (range) ? (range.c1 === arn.c1) : false;
				var drawRightSide  = (range) ? (range.c2 === arn.c2) : false;
				var drawTopSide    = (range) ? (range.r1 === arn.r1) : false;
				var drawBottomSide = (range) ? (range.r2 === arn.r2) : false;
				var l, t, r, b, cr, offs, offs2;
				// Размеры "квадрата" автозаполнения
				var fillHandleWidth = 2 * this.width_2px + this.width_1px;
				var fillHandleHeight = 2 * this.height_2px + this.height_1px;

				// Координаты выделения для автозаполнения
				var xFH1 = 0;
				var xFH2 = 0;
				var yFH1 = 0;
				var yFH2 = 0;
				// Рисуем ли мы стороны автозаполнения
				var drawLeftFillHandle;
				var drawRightFillHandle;
				var drawTopFillHandle;
				var drawBottomFillHandle;

				// set clipping rect to cells area
				ctx.save()
						.beginPath()
						.rect(this.cellsLeft, this.cellsTop, ctx.getWidth() - this.cellsLeft, ctx.getHeight() - this.cellsTop)
						.clip();

				// draw frame around cells range
				l = drawLeftSide ? (-2) : 0;
				r = drawRightSide ? (+1) : 0;
				t = drawTopSide ? (-2) : 0;
				b = drawBottomSide ? (+1) : 0;
				offs = -.5;
				offs2 = -.5;

				ctx.setStrokeStyle(opt.activeCellBorderColor)
						.setLineWidth(3)
						.beginPath();

				if (aFHIntersection) {
					// Считаем координаты автозаполнения
					xFH1 = this.cols[aFHIntersection.c1].left - offsetX;
					xFH2 = this.cols[aFHIntersection.c2].left + this.cols[aFHIntersection.c2].width - offsetX;
					yFH1 = this.rows[aFHIntersection.r1].top - offsetY;
					yFH2 = this.rows[aFHIntersection.r2].top + this.rows[aFHIntersection.r2].height - offsetY;
					drawLeftFillHandle = aFHIntersection.c1 === aFH.c1;
					drawRightFillHandle = aFHIntersection.c2 === aFH.c2;
					drawTopFillHandle = aFHIntersection.r1 === aFH.r1;
					drawBottomFillHandle = aFHIntersection.r2 === aFH.r2;

					// Если мы не в нулевом состоянии, то рисуем обводку автозаполнения (толстой линией)
					if (aFHIntersection.c1 !== aFHIntersection.c2 || aFHIntersection.r1 !== aFHIntersection.r2 || 2 !== this.fillHandleArea) {
						if (drawTopFillHandle)    {ctx.moveTo(xFH1, yFH1, l, offs).lineTo(xFH2, yFH1, r, offs);}
						if (drawBottomFillHandle) {ctx.moveTo(xFH1, yFH2, l, offs2).lineTo(xFH2, yFH2, r, offs2);}
						if (drawLeftFillHandle)   {ctx.moveTo(xFH1, yFH1, offs, t).lineTo(xFH1, yFH2, offs, b);}
						if (drawRightFillHandle)  {ctx.moveTo(xFH2, yFH1, offs2, t).lineTo(xFH2, yFH2, offs2, b);}
					}

					// Для некоторых вариантов областей нужно дорисовывать обводку для выделенной области
					switch (this.fillHandleArea){
						case 1:
							switch(this.fillHandleDirection){
								case 0:
									// Горизонтальный
									if (drawLeftSide)   {ctx.moveTo(x1, y1, offs, t).lineTo(x1, y2, offs, b);}
									break;
								case 1:
									// Вертикальный
									if (drawTopSide)    {ctx.moveTo(x1, y1, l, offs).lineTo(x2, y1, r, offs);}
									break;
							}
							break;
						case 2:
							// Для внутренней области нужны все обводки
							if (drawTopSide)    {ctx.moveTo(x1, y1, l, offs).lineTo(x2, y1, r, offs);}
							if (drawBottomSide) {ctx.moveTo(x1, y2, l, offs2).lineTo(x2, y2, r, offs2);}
							if (drawLeftSide)   {ctx.moveTo(x1, y1, offs, t).lineTo(x1, y2, offs, b);}
							if (drawRightSide)  {ctx.moveTo(x2, y1, offs2, t).lineTo(x2, y2, offs2, b);}
							break;
						case 3:
							switch(this.fillHandleDirection){
								case 0:
									// Горизонтальный
									if (range && aFH.c2 !== range.c2){
										if (drawRightSide)  {ctx.moveTo(x2, y1, offs2, t).lineTo(x2, y2, offs2, b);}
									}
									break;
								case 1:
									// Вертикальный
									if (range && aFH.r2 !== range.r2){
										if (drawBottomSide) {ctx.moveTo(x1, y2, l, offs2).lineTo(x2, y2, r, offs2);}
									}
									break;
							}
							break;
					}

					ctx.stroke();
				} else {
					// Автозаполнения нет, просто рисуем обводку
					if (drawTopSide)    {ctx.moveTo(x1, y1, l, offs).lineTo(x2, y1, r, offs);}
					if (drawBottomSide) {ctx.moveTo(x1, y2, l, offs2).lineTo(x2 - fillHandleWidth, y2, r, offs2);}
					if (drawLeftSide)   {ctx.moveTo(x1, y1, offs, t).lineTo(x1, y2, offs, b);}
					if (drawRightSide)  {ctx.moveTo(x2, y1, offs2, t).lineTo(x2, y2 - fillHandleHeight, offs2, b);}
				}
				ctx.stroke();

				// draw cells overlay
				if (range) {
					var lRect = x1 + (drawLeftSide ? this.width_2px : 0),
					rRect = x2 - (drawRightSide ? this.width_3px : this.width_1px),
					tRect = y1 + (drawTopSide ? this.height_2px : 0),
					bRect = y2 - (drawBottomSide ? this.width_3px : this.height_1px);
					ctx.setFillStyle( opt.activeCellBackground )
							.fillRect(lRect, tRect, rRect - lRect, bRect - tRect);

					var firstCell = (!this.isSelectDialogRangeMode) ? this.activeRange : this.copyOfActiveRange;
					cr = this._getMergedCellsRange(firstCell.startCol, firstCell.startRow);
					// Получаем активную ячейку в выделении
					cr = range.intersection(cr !== undefined ? cr : asc_Range(firstCell.startCol, firstCell.startRow, firstCell.startCol, firstCell.startRow));
					if (cr !== null) {
						ctx.save().beginPath().rect(lRect, tRect, rRect - lRect, bRect - tRect).clip();
						var _l = this.cols[cr.c1].left - offsetX - this.width_1px,
						_r = this.cols[cr.c2].left + this.cols[cr.c2].width - offsetX,
						_t = this.rows[cr.r1].top - offsetY - this.height_1px,
						_b = this.rows[cr.r2].top + this.rows[cr.r2].height - offsetY;
						ctx.clearRect(_l, _t, _r - _l, _b - _t).restore();
					}

					// Рисуем "квадрат" для автозаполнения (располагается "квадрат" в правом нижнем углу последней ячейки выделения)
					cr = range.intersection(asc_Range(range.c2, range.r2, range.c2, range.r2));
					if (cr !== null) {
						this.fillHandleL = this.cols[cr.c1].left - offsetX + this.cols[cr.c1].width - this.width_1px - this.width_2px;
						this.fillHandleR = this.fillHandleL + fillHandleWidth;
						this.fillHandleT = this.rows[cr.r1].top - offsetY + this.rows[cr.r1].height - this.height_1px - this.height_2px;
						this.fillHandleB = this.fillHandleT + fillHandleHeight;

						ctx.setFillStyle (opt.activeCellBorderColor).fillRect(this.fillHandleL, this.fillHandleT, this.fillHandleR - this.fillHandleL, this.fillHandleB - this.fillHandleT);
					}
				}

				// draw fill handle select
				if (this.activeFillHandle !== null) {
					if (2 === this.fillHandleArea && (aFH.c1 !== aFH.c2 || aFH.r1 !== aFH.r2)){
						// Для внутренней области мы должны "залить" еще и область автозаполнения
						var lFH = xFH1 + (drawLeftFillHandle ? this.width_2px : 0),
						rFH = xFH2 - (drawRightFillHandle ? this.width_3px : this.width_1px),
						tFH = yFH1 + (drawTopFillHandle ? this.height_2px : 0),
						bFH = yFH2 - (drawBottomFillHandle ? this.width_3px : this.height_1px);
						ctx.setFillStyle( opt.activeCellBackground )
							.fillRect(lFH, tFH, rFH - lFH, bFH - tFH);
					}

					ctx.setStrokeStyle(opt.fillHandleBorderColorSelect).setLineWidth(1).beginPath();

					if (aFH.c1 !== aFH.c2 || aFH.r1 !== aFH.r2 || 2 !== this.fillHandleArea) {
						// Рисуем обводку для области автозаполнения, если мы выделили что-то
						if (drawTopFillHandle)    {ctx.moveTo(xFH1 + this.width_1px, yFH1, l, offs).lineTo(xFH2 - this.width_1px, yFH1, r, offs);}
						if (drawBottomFillHandle) {ctx.moveTo(xFH1 + this.width_1px, yFH2, l, offs2).lineTo(xFH2 - this.width_1px, yFH2, r, offs2);}
						if (drawLeftFillHandle)   {ctx.moveTo(xFH1, yFH1 + this.height_1px, offs, t).lineTo(xFH1, yFH2 - this.height_1px, offs, b);}
						if (drawRightFillHandle)  {ctx.moveTo(xFH2, yFH1 + this.height_1px, offs2, t).lineTo(xFH2, yFH2 - this.height_1px, offs2, b);}
					}

					if (2 === this.fillHandleArea){
						// Если мы внутри, еще рисуем обводку для выделенной области
						if (drawTopSide)    {ctx.moveTo(x1 + this.width_1px, y1, l, offs).lineTo(x2 - this.width_1px, y1, r, offs);}
						if (drawBottomSide) {ctx.moveTo(x1 + this.width_1px, y2, l, offs2).lineTo(x2 - this.width_1px, y2, r, offs2);}
						if (drawLeftSide)   {ctx.moveTo(x1, y1 + this.height_1px, offs, t).lineTo(x1, y2 - this.height_1px, offs, b);}
						if (drawRightSide)  {ctx.moveTo(x2, y1 + this.height_1px, offs2, t).lineTo(x2, y2 - this.height_1px, offs2, b);}
					}

					ctx.stroke();
				}

				if (this.isFormulaEditMode) {
					this._drawFormulaRange(this.arrActiveFormulaRanges)
				}

				if (this.isChartAreaEditMode) {
					this._drawFormulaRange(this.arrActiveChartsRanges)
				}

				if (this.isSelectDialogRangeMode) {
					this._drawSelectRange(this.activeRange.clone(true));
				}

				if (null !== this.activeMoveRange) {
					ctx.setStrokeStyle("rgba(0,0,0,1)")
						.setLineWidth(1)
						.beginPath();
					var aActiveMoveRangeIntersection = this.activeMoveRange.intersection(this.visibleRange);
					if (aActiveMoveRangeIntersection) {
						var drawLeftSideMoveRange   = aActiveMoveRangeIntersection.c1 === this.activeMoveRange.c1;
						var drawRightSideMoveRange  = aActiveMoveRangeIntersection.c2 === this.activeMoveRange.c2;
						var drawTopSideMoveRange    = aActiveMoveRangeIntersection.r1 === this.activeMoveRange.r1;
						var drawBottomSideMoveRange = aActiveMoveRangeIntersection.r2 === this.activeMoveRange.r2;

						var xMoveRange1 = this.cols[aActiveMoveRangeIntersection.c1].left - offsetX;
						var xMoveRange2 = this.cols[aActiveMoveRangeIntersection.c2].left + this.cols[aActiveMoveRangeIntersection.c2].width - offsetX;
						var yMoveRange1 = this.rows[aActiveMoveRangeIntersection.r1].top - offsetY;
						var yMoveRange2 = this.rows[aActiveMoveRangeIntersection.r2].top + this.rows[aActiveMoveRangeIntersection.r2].height - offsetY;

						if (drawTopSideMoveRange)    {ctx.moveTo(xMoveRange1, yMoveRange1, -0.5, -0.5).lineTo(xMoveRange2, yMoveRange1, -0.5, -0.5);}
						if (drawBottomSideMoveRange) {ctx.moveTo(xMoveRange1, yMoveRange2, -0.5, -0.5).lineTo(xMoveRange2, yMoveRange2, -0.5, -0.5);}
						if (drawLeftSideMoveRange)   {ctx.moveTo(xMoveRange1, yMoveRange1, -0.5, -0.5).lineTo(xMoveRange1, yMoveRange2, -0.5, -0.5);}
						if (drawRightSideMoveRange)  {ctx.moveTo(xMoveRange2, yMoveRange1, -0.5, -0.5).lineTo(xMoveRange2, yMoveRange2, -0.5, -0.5);}
					}
					ctx.stroke();
				}

				
				// restore canvas' original clipping range
				ctx.restore();
				if(!this.isChartAreaEditMode){
					this.objectRender.showDrawingObjectsLocks();
					this.objectRender.raiseLayerDrawingObjects(true);
				}
				this.cellCommentator.drawCommentCells(false);

				this._drawActiveHeaders();
			},
			
			_drawFormulaRange: function(arr){
				var ctx = this.overlayCtx,
					opt = this.settings,
					offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft,
					offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
					
				ctx.setLineWidth(1);
					
				for (var i in arr) {
					var arFormulaTmp = arr[i].clone(true);
					var aFormulaIntersection = arFormulaTmp.intersection(this.visibleRange);

					if (aFormulaIntersection) {
						ctx.beginPath()
							.setStrokeStyle(opt.formulaRangeBorderColor[i%opt.formulaRangeBorderColor.length])
							.setFillStyle(opt.formulaRangeBorderColor[i%opt.formulaRangeBorderColor.length]);
						var drawLeftSideFormula   = aFormulaIntersection.c1 === arFormulaTmp.c1;
						var drawRightSideFormula  = aFormulaIntersection.c2 === arFormulaTmp.c2;
						var drawTopSideFormula    = aFormulaIntersection.r1 === arFormulaTmp.r1;
						var drawBottomSideFormula = aFormulaIntersection.r2 === arFormulaTmp.r2;

						var xFormula1 = this.cols[aFormulaIntersection.c1].left - offsetX;
						var xFormula2 = this.cols[aFormulaIntersection.c2].left + this.cols[aFormulaIntersection.c2].width - offsetX;
						var yFormula1 = this.rows[aFormulaIntersection.r1].top - offsetY;
						var yFormula2 = this.rows[aFormulaIntersection.r2].top + this.rows[aFormulaIntersection.r2].height - offsetY;

						if (drawTopSideFormula)    {ctx.moveTo(xFormula1, yFormula1, -0.5, -0.5).lineTo(xFormula2+0.5, yFormula1, -0.5, -0.5);}
						if (drawBottomSideFormula) {ctx.moveTo(xFormula1, yFormula2, -0.5, -0.5).lineTo(xFormula2, yFormula2, -0.5, -0.5);}
						if (drawLeftSideFormula)   {ctx.moveTo(xFormula1, yFormula1, -0.5, -0.5).lineTo(xFormula1, yFormula2, -0.5, -0.5);}
						if (drawRightSideFormula)  {ctx.moveTo(xFormula2, yFormula1, -0.5, -0.5).lineTo(xFormula2, yFormula2, -0.5, -0.5);}
						
						if( drawLeftSideFormula && drawTopSideFormula )
							ctx.rect(xFormula1, yFormula1, 2, 2, -0.5, -0.5);
							
						if( drawRightSideFormula && drawTopSideFormula )
							ctx.rect(xFormula2-3, yFormula1, 1.5, 2, -0.5, -0.5);
							
						if( drawRightSideFormula && drawBottomSideFormula)
							ctx.rect(xFormula2-3, yFormula2-3, 2, 2, -0.5, -0.5);
							
						if( drawLeftSideFormula && drawBottomSideFormula)
							ctx.rect(xFormula1, yFormula2-3, 2, 2, -0.5, -0.5);
						
						ctx.closePath()
							.stroke()
							.fill();
					}
				}
			},

			_drawSelectRange: function (oSelectRange) {
				var ctx = this.overlayCtx,
					offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft,
					offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;

				ctx.setLineWidth(2);

				var oSelectRangeIntersection = oSelectRange.intersection(this.visibleRange);
				if (oSelectRangeIntersection) {
					ctx.beginPath()
						.setStrokeStyle(c_oAscCoAuthoringOtherBorderColor);
					var drawLeftSideSelectRange   = oSelectRangeIntersection.c1 === oSelectRange.c1;
					var drawRightSideSelectRange  = oSelectRangeIntersection.c2 === oSelectRange.c2;
					var drawTopSideSelectRange    = oSelectRangeIntersection.r1 === oSelectRange.r1;
					var drawBottomSideSelectRange = oSelectRangeIntersection.r2 === oSelectRange.r2;

					var xSelectRange1 = this.cols[oSelectRangeIntersection.c1].left - offsetX;
					var xSelectRange2 = this.cols[oSelectRangeIntersection.c2].left + this.cols[oSelectRangeIntersection.c2].width - offsetX;
					var ySelectRange1 = this.rows[oSelectRangeIntersection.r1].top - offsetY;
					var ySelectRange2 = this.rows[oSelectRangeIntersection.r2].top + this.rows[oSelectRangeIntersection.r2].height - offsetY;

					if (drawTopSideSelectRange)		{ctx.dashLine(xSelectRange1, ySelectRange1, xSelectRange2, ySelectRange1, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);}
					if (drawBottomSideSelectRange)	{ctx.dashLine(xSelectRange1, ySelectRange2, xSelectRange2, ySelectRange2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);}
					if (drawLeftSideSelectRange)	{ctx.dashLine(xSelectRange1, ySelectRange1, xSelectRange1, ySelectRange2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);}
					if (drawRightSideSelectRange)	{ctx.dashLine(xSelectRange2, ySelectRange1, xSelectRange2, ySelectRange2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);}

					ctx.closePath().stroke().fill();
				}
			},
			
			_drawCollaborativeElements: function (bIsDrawObjects) {
				if (this.collaborativeEditing.getCollaborativeEditing()) {
					//this.overlayCtx.ctx.globalAlpha = 1;
					this._drawCollaborativeElementsMeOther (c_oAscLockTypes.kLockTypeMine, bIsDrawObjects);
					this._drawCollaborativeElementsMeOther (c_oAscLockTypes.kLockTypeOther, bIsDrawObjects);
					this._drawCollaborativeElementsAllLock ();
				}
			},

			_drawCollaborativeElementsAllLock: function () {
				var ctx = this.overlayCtx;
				var currentSheetId = this.model.getId();
				var nLockAllType = this.collaborativeEditing.isLockAllOther(currentSheetId);
				if (c_oAscMouseMoveLockedObjectType.None !== nLockAllType) {
					var styleColor = (c_oAscMouseMoveLockedObjectType.TableProperties === nLockAllType) ?
						c_oAscCoAuthoringLockTablePropertiesBorderColor : c_oAscCoAuthoringOtherBorderColor;
					ctx.setStrokeStyle(styleColor).setLineWidth(2).beginPath();

					var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
					var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
					var arAllRange = asc_Range (0, 0, gc_nMaxCol0, gc_nMaxRow0);

					var aFormulaIntersection = arAllRange.intersection(this.visibleRange);

					if (aFormulaIntersection) {
						var drawLeftSideFormula   = aFormulaIntersection.c1 === arAllRange.c1;
						var drawRightSideFormula  = aFormulaIntersection.c2 === arAllRange.c2;
						var drawTopSideFormula    = aFormulaIntersection.r1 === arAllRange.r1;
						var drawBottomSideFormula = aFormulaIntersection.r2 === arAllRange.r2;

						var xFormula1 = this.cols[aFormulaIntersection.c1].left - offsetX;
						var xFormula2 = this.cols[aFormulaIntersection.c2].left + this.cols[aFormulaIntersection.c2].width - offsetX;
						var yFormula1 = this.rows[aFormulaIntersection.r1].top - offsetY;
						var yFormula2 = this.rows[aFormulaIntersection.r2].top + this.rows[aFormulaIntersection.r2].height - offsetY;

						if (drawTopSideFormula)		{ctx.dashLine(xFormula1, yFormula1, xFormula2, yFormula1, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);}
						if (drawBottomSideFormula)	{ctx.dashLine(xFormula1, yFormula2, xFormula2, yFormula2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);}
						if (drawLeftSideFormula)	{ctx.dashLine(xFormula1, yFormula1, xFormula1, yFormula2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);}
						if (drawRightSideFormula)	{ctx.dashLine(xFormula2, yFormula1, xFormula2, yFormula2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);}
					}

					ctx.stroke();
					ctx.restore();
				}
			},

			_drawCollaborativeElementsMeOther: function (type, bIsDrawObjects) {
				var ctx = this.overlayCtx;
				var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
				var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
				var i;

				var currentSheetId = this.model.getId();
				var styleColor = (c_oAscLockTypes.kLockTypeMine === type) ? c_oAscCoAuthoringMeBorderColor : c_oAscCoAuthoringOtherBorderColor;
				var arrayCells = (c_oAscLockTypes.kLockTypeMine === type) ? this.collaborativeEditing.getLockCellsMe(currentSheetId) : this.collaborativeEditing.getLockCellsOther(currentSheetId);
				if (c_oAscLockTypes.kLockTypeMine === type) {
					arrayCells = arrayCells.concat(this.collaborativeEditing.getArrayInsertColumnsBySheetId(currentSheetId));
					arrayCells = arrayCells.concat(this.collaborativeEditing.getArrayInsertRowsBySheetId(currentSheetId));
				}

				if (bIsDrawObjects) {
					var objectState = (c_oAscLockTypes.kLockTypeMine === type) ? c_oAscObjectLockState.Off : c_oAscObjectLockState.On;
					var arrayObjects = (c_oAscLockTypes.kLockTypeMine === type) ? this.collaborativeEditing.getLockObjectsMe(currentSheetId) : this.collaborativeEditing.getLockObjectsOther(currentSheetId);
					
					//this.objectRender.resetLockedDrawingObjects();
					for (i = 0; i < arrayObjects.length; ++i) {
						this.objectRender.selectLockedDrawingObject(arrayObjects[i], objectState);
					}
				}

				// set clipping rect to cells area
				ctx.save()
					.beginPath()
					.rect(this.cellsLeft, this.cellsTop, ctx.getWidth() - this.cellsLeft, ctx.getHeight() - this.cellsTop)
					.clip();

				ctx.setStrokeStyle(styleColor).setLineWidth(2).beginPath();

				for (i = 0; i < arrayCells.length; ++i) {
					var arFormulaTmp = asc_Range (arrayCells[i].c1, arrayCells[i].r1, arrayCells[i].c2, arrayCells[i].r2);

					var aFormulaIntersection = arFormulaTmp.intersection(this.visibleRange);

					if (aFormulaIntersection) {
						var drawLeftSideFormula   = aFormulaIntersection.c1 === arFormulaTmp.c1;
						var drawRightSideFormula  = aFormulaIntersection.c2 === arFormulaTmp.c2;
						var drawTopSideFormula    = aFormulaIntersection.r1 === arFormulaTmp.r1;
						var drawBottomSideFormula = aFormulaIntersection.r2 === arFormulaTmp.r2;

						var xFormula1 = this.cols[aFormulaIntersection.c1].left - offsetX;
						var xFormula2 = this.cols[aFormulaIntersection.c2].left + this.cols[aFormulaIntersection.c2].width - offsetX;
						var yFormula1 = this.rows[aFormulaIntersection.r1].top - offsetY;
						var yFormula2 = this.rows[aFormulaIntersection.r2].top + this.rows[aFormulaIntersection.r2].height - offsetY;

						if (drawTopSideFormula)		{ctx.dashLine(xFormula1, yFormula1, xFormula2, yFormula1, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);}
						if (drawBottomSideFormula)	{ctx.dashLine(xFormula1, yFormula2, xFormula2, yFormula2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);}
						if (drawLeftSideFormula)	{ctx.dashLine(xFormula1, yFormula1, xFormula1, yFormula2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);}
						if (drawRightSideFormula)	{ctx.dashLine(xFormula2, yFormula1, xFormula2, yFormula2, c_oAscCoAuthoringDottedWidth, c_oAscCoAuthoringDottedDistance);}
					}
					if ( c_oAscLockTypes.kLockTypeOther == type )
						this.cellCommentator.callLockComments(arrayCells[i]);
				}

				ctx.stroke();
				ctx.restore();
			},

			cleanSelection: function () {
				var ctx = this.overlayCtx;
				var arn = this.activeRange.clone(true);
				var width = ctx.getWidth();
				var height = ctx.getHeight();
				var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
				var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
				var x1 = this.cols[arn.c1].left - offsetX - this.width_2px;
				var x2 = this.cols[arn.c2].left + this.cols[arn.c2].width - offsetX + this.width_1px + /* Это ширина "квадрата" для автофильтра от границы ячейки */this.width_2px;
				var y1 = this.rows[arn.r1].top - offsetY - this.height_2px;
				var y2 = this.rows[arn.r2].top + this.rows[arn.r2].height - offsetY + this.height_1px + /* Это высота "квадрата" для автофильтра от границы ячейки */this.height_2px;
				var i;

				this._activateOverlayCtx();
				this._cleanColumnHeaders(arn.c1, arn.c2);
				this._cleanRowHeades(arn.r1, arn.r2);
				this._deactivateOverlayCtx();

				// Если есть активное автозаполнения, то нужно его тоже очистить
				if (this.activeFillHandle !== null) {
					var activeFillClone = this.activeFillHandle.clone(true);
					activeFillClone.normalize();

					// Координаты для автозаполнения
					var xFH1 = this.cols[activeFillClone.c1].left - offsetX - this.width_2px;
					var xFH2 = this.cols[activeFillClone.c2].left + this.cols[activeFillClone.c2].width - offsetX + this.width_1px + this.width_2px;
					var yFH1 = this.rows[activeFillClone.r1].top - offsetY - this.height_2px;
					var yFH2 = this.rows[activeFillClone.r2].top + this.rows[activeFillClone.r2].height - offsetY + this.height_1px + this.height_2px;

					// Выбираем наибольший range для очистки
					x1 = Math.min(x1, xFH1);
					x2 = Math.max(x2, xFH2);
					y1 = Math.min(y1, yFH1);
					y2 = Math.max(y2, yFH2);
				}

				if (this.collaborativeEditing.getCollaborativeEditing ()) {
					var currentSheetId = this.model.getId();

					var nLockAllType = this.collaborativeEditing.isLockAllOther(currentSheetId);
					if (c_oAscMouseMoveLockedObjectType.None !== nLockAllType) {
						this.overlayCtx.clear();
					} else {
						var arrayElementsMe = this.collaborativeEditing.getLockCellsMe(currentSheetId);
						var arrayElementsOther = this.collaborativeEditing.getLockCellsOther(currentSheetId);
						var arrayElements = arrayElementsMe.concat (arrayElementsOther);
						arrayElements = arrayElements.concat(this.collaborativeEditing.getArrayInsertColumnsBySheetId(currentSheetId));
						arrayElements = arrayElements.concat(this.collaborativeEditing.getArrayInsertRowsBySheetId(currentSheetId));

						for (i = 0; i < arrayElements.length; ++i) {
							var arFormulaTmp = asc_Range (arrayElements[i].c1, arrayElements[i].r1, arrayElements[i].c2, arrayElements[i].r2);

							var aFormulaIntersection = arFormulaTmp.intersection(this.visibleRange);

							if (aFormulaIntersection) {
								// Координаты для автозаполнения
								var xCE1 = this.cols[aFormulaIntersection.c1].left - offsetX - this.width_2px;
								var xCE2 = this.cols[aFormulaIntersection.c2].left + this.cols[aFormulaIntersection.c2].width - offsetX + this.width_1px + this.width_2px;
								var yCE1 = this.rows[aFormulaIntersection.r1].top - offsetY - this.height_2px;
								var yCE2 = this.rows[aFormulaIntersection.r2].top + this.rows[aFormulaIntersection.r2].height - offsetY + this.height_1px + this.height_2px;

								// Выбираем наибольший range для очистки
								x1 = Math.min(x1, xCE1);
								x2 = Math.max(x2, xCE2);
								y1 = Math.min(y1, yCE1);
								y2 = Math.max(y2, yCE2);
							}
						}
					}
				}

				if (0 < this.arrActiveFormulaRanges.length) {
					for (i = 0; i < this.arrActiveFormulaRanges.length; ++i) {
						var activeFormula = this.arrActiveFormulaRanges[i].clone(true);

						activeFormula = this.visibleRange.intersection(activeFormula);
						if (null === activeFormula) {
							// это ссылка из формулы на еще не добавленный рэндж
							continue;
						}

						// Координаты для range формулы
						var xF1 = this.cols[activeFormula.c1].left - offsetX - this.width_2px;
						var xF2 = activeFormula.c2 > this.cols.length ? width : this.cols[activeFormula.c2].left + this.cols[activeFormula.c2].width - offsetX + this.width_1px;
						var yF1 = this.rows[activeFormula.r1].top - offsetY - this.height_2px;
						var yF2 = activeFormula.r2 > this.rows.length ? height : this.rows[activeFormula.r2].top + this.rows[activeFormula.r2].height - offsetY + this.height_1px;

						// Выбираем наибольший range для очистки
						x1 = Math.min(x1, xF1);
						x2 = Math.max(x2, xF2);
						y1 = Math.min(y1, yF1);
						y2 = Math.max(y2, yF2);
					}

					// Вышли из редактора, очистим массив
					if (false === this.isFormulaEditMode) {
						this.arrActiveFormulaRanges = [];
					}
				}

				if (0 < this.arrActiveChartsRanges.length) {
					for (i in this.arrActiveChartsRanges ) {
						var activeFormula = this.arrActiveChartsRanges[i].clone(true);

						activeFormula = this.visibleRange.intersection(activeFormula);
						if (null === activeFormula) {
							// это ссылка из формулы на еще не добавленный рэндж
							continue;
						}

						// Координаты для range формулы
						var xF1 = this.cols[activeFormula.c1].left - offsetX - this.width_2px;
						var xF2 = activeFormula.c2 > this.cols.length ? width : this.cols[activeFormula.c2].left + this.cols[activeFormula.c2].width - offsetX + this.width_1px;
						var yF1 = this.rows[activeFormula.r1].top - offsetY - this.height_2px;
						var yF2 = activeFormula.r2 > this.rows.length ? height : this.rows[activeFormula.r2].top + this.rows[activeFormula.r2].height - offsetY + this.height_1px;

						// Выбираем наибольший range для очистки
						x1 = Math.min(x1, xF1);
						x2 = Math.max(x2, xF2);
						y1 = Math.min(y1, yF1);
						y2 = Math.max(y2, yF2);
					}

					// Вышли из редактора, очистим массив
					// if (false === this.isFormulaEditMode) {
						// this.arrActiveFormulaRanges = [];
					// }
				}

				if (null !== this.activeMoveRange) {
					var activeMoveRangeClone = this.activeMoveRange.clone(true);
					
					// Увеличиваем, если выходим за область видимости // Critical Bug 17413
					while ( !this.cols[activeMoveRangeClone.c2] ) {
						this.expandColsOnScroll(true);
						this._trigger("reinitializeScrollX");
					}
					while ( !this.rows[activeMoveRangeClone.r2] ) {
						this.expandRowsOnScroll(true);
						this._trigger("reinitializeScrollY");
					}
					
					// Координаты для перемещения диапазона
					var xMR1 = this.cols[activeMoveRangeClone.c1].left - offsetX - this.width_2px;
					var xMR2 = this.cols[activeMoveRangeClone.c2].left + this.cols[activeMoveRangeClone.c2].width - offsetX + this.width_1px + this.width_2px;
					var yMR1 = this.rows[activeMoveRangeClone.r1].top - offsetY - this.height_2px;
					var yMR2 = this.rows[activeMoveRangeClone.r2].top + this.rows[activeMoveRangeClone.r2].height - offsetY + this.height_1px + this.height_2px;

					// Выбираем наибольший range для очистки
					x1 = Math.min(x1, xMR1);
					x2 = Math.max(x2, xMR2);
					y1 = Math.min(y1, yMR1);
					y2 = Math.max(y2, yMR2);
				}

				if (null !== this.copyOfActiveRange) {
					// Координаты для перемещения диапазона
					var xCopyAr1 = this.cols[this.copyOfActiveRange.c1].left - offsetX - this.width_2px;
					var xCopyAr2 = this.cols[this.copyOfActiveRange.c2].left + this.cols[this.copyOfActiveRange.c2].width - offsetX + this.width_1px + this.width_2px;
					var yCopyAr1 = this.rows[this.copyOfActiveRange.r1].top - offsetY - this.height_2px;
					var yCopyAr2 = this.rows[this.copyOfActiveRange.r2].top + this.rows[this.copyOfActiveRange.r2].height - offsetY + this.height_1px + this.height_2px;

					// Выбираем наибольший range для очистки
					x1 = Math.min(x1, xCopyAr1);
					x2 = Math.max(x2, xCopyAr2);
					y1 = Math.min(y1, yCopyAr1);
					y2 = Math.max(y2, yCopyAr2);
				}

				ctx.save()
						.beginPath()
						.rect(this.cellsLeft, this.cellsTop, ctx.getWidth() - this.cellsLeft, ctx.getHeight() - this.cellsTop)
						.clip()
						.clearRect(x1, y1, x2 - x1, y2 - y1)
						.restore();
				return this;
			},

			updateSelection: function () {
				this.cleanSelection();
				this._drawSelection();
			},

			// mouseX - это разница стартовых координат от мыши при нажатии и границы
			drawColumnGuides: function (col, x, y, mouseX) {
				var t = this;

				x *= asc_getcvt( 0/*px*/, 1/*pt*/, t._getPPIX() );
				// Учитываем координаты точки, где мы начали изменение размера
				x += mouseX;

				var ctx = t.overlayCtx;
				var offsetX = t.cols[t.visibleRange.c1].left - t.cellsLeft;
				var x1 = t.cols[col].left - offsetX - this.width_1px;
				var h = ctx.getHeight();

				ctx.clear();
				t._drawSelection();
				ctx.setFillPattern(t.ptrnLineDotted1)
						.fillRect(x1, 0, this.width_1px, h)
						.fillRect(x, 0, this.width_1px, h);
			},

			// mouseY - это разница стартовых координат от мыши при нажатии и границы
			drawRowGuides: function (row, x, y, mouseY) {
				var t = this;

				y *= asc_getcvt( 0/*px*/, 1/*pt*/, t._getPPIY() );
				// Учитываем координаты точки, где мы начали изменение размера
				y += mouseY;

				var ctx = t.overlayCtx;
				var offsetY = t.rows[t.visibleRange.r1].top - t.cellsTop;
				var y1 = t.rows[row].top - offsetY - this.height_1px;
				var w = ctx.getWidth();

				ctx.clear();
				t._drawSelection();
				ctx.setFillPattern(t.ptrnLineDotted1)
						.fillRect(0, y1, w, this.height_1px)
						.fillRect(0, y, w, this.height_1px);
			},

			updateDrawingObjectDone: function () {
				var t = this, lockInfo;				
				var updateObjectCallback = function (res) {
					
					t.overlayCtx.ctx.globalAlpha = 1;
					if (res) {
						// Все хорошо, мы залочили, теперь применяем
						t.objectRender.showDrawingObjects(true, null, false);
					}
					else {
						// Не удалось, восстанавливаем состояние
						t.objectRender.restoreLockedDrawingObject();
					}
					t._drawCollaborativeElements(/*bIsDrawObjects*/true);
				};

				var sheetId = this.model.getId();
				var objectId = t.objectRender.getSelectedDrawingObjectId();
				
				if ( objectId && t.objectRender.isChangedDrawingObject(objectId) ) {
					if (false === t.collaborativeEditing.isCoAuthoringExcellEnable()) {
						// Запрещено совместное редактирование
						updateObjectCallback(true);
						return;
					}

					lockInfo = t.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, /*subType*/null, sheetId, objectId);

					if (false === t.collaborativeEditing.getCollaborativeEditing()) {
						// Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
						updateObjectCallback(true);
						updateObjectCallback = undefined;
					} else if (false !== t.collaborativeEditing.getLockIntersection(lockInfo,
						c_oAscLockTypes.kLockTypeMine, /*bCheckOnlyLockAll*/false)) {
						// Редактируем сами
						updateObjectCallback (true);
						return;
					}
					else if (false !== t.collaborativeEditing.getLockIntersection(lockInfo,
						c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false)) {
						// Уже ячейку кто-то редактирует
						updateObjectCallback (false);
						return;
					}

					t.collaborativeEditing.onStartCheckLock();
					t.collaborativeEditing.addCheckLock(lockInfo);
					t.collaborativeEditing.onEndCheckLock(updateObjectCallback);
				}
				else
					t.objectRender.clearUndoRedoDrawingObject();
					
				t.overlayCtx.ctx.globalAlpha = 1;
				if ( objectId )
					t.objectRender.selectDrawingObject(t.objectRender.getSelectedDrawingObjectIndex());
			},


			// --- Cache ---

			_cleanCache: function (range) {
				var t = this, r, c, row, id, rid;

				function deleteIndex(range) {
					for (var r = range.r1; r <= range.r2 && r < t.rows.length; ++r) {
						for (var c = range.c1; c <= range.c2 && c < t.cols.length; ++c) {
							var id = t._getMergedCellIndex(c, r);
							delete t.cache.mergedCells.index[id];
						}
					}
				}

				if (range === undefined) {range = t.activeRange.clone(true);}

				for (r = range.r1; r <= range.r2; ++r) {
					row = t.cache.rows[r];
					for (c = range.c1; c <= range.c2; ++c) {
						if (row !== undefined) {
							if (row.columns[c]) {delete row.columns[c];}
							if (row.columnsWithText[c]) {delete row.columnsWithText[c];}
							if (row.erasedLB[c]) {delete row.erasedLB[c];}
							if (row.erasedRB[c-1]) {delete row.erasedRB[c-1];}
						}
						id = t._getMergedCellIndex(c, r);
						rid = t.cache.mergedCells.index[id];
						if (rid !== undefined) {
							deleteIndex(t.cache.mergedCells.ranges[rid]);
							delete t.cache.mergedCells.ranges[rid];
						}
					}
					if (row !== undefined) {
						if (row.erasedLB[c]) {delete row.erasedLB[c];}
						if (row.erasedRB[c-1]) {delete row.erasedRB[c-1];}
						if (row.columns) {
							if (row.columns[range.c1-1] && row.columns[range.c1-1].borders) {delete row.columns[range.c1-1].borders.r;}
							if (row.columns[range.c2+1] && row.columns[range.c2+1].borders) {delete row.columns[range.c2+1].borders.l;}
						}
					}
				}

				row = t.cache.rows[range.r1-1];
				if (row !== undefined) {
					for (c = range.c1; c <= range.c2; ++c) {
						if (row.columns[c] && row.columns[c].borders) {delete row.columns[c].borders.b;}
					}
				}

				row = t.cache.rows[range.r2+1];
				if (row !== undefined) {
					for (c = range.c1; c <= range.c2; ++c) {
						if (row.columns[c] && row.columns[c].borders) {delete row.columns[c].borders.t;}
					}
				}
			},


			// ----- Cell text cache -----

			/** Очищает кэш метрик текста ячеек */
			_cleanCellsTextMetricsCache: function () {
				var s = this.cache.sectors = [];
				var vr = this.visibleRange;
				var h = vr.r2 + 1 - vr.r1;
				var rl = this.rows.length;
				var rc = asc_floor(rl / h) + (rl % h > 0 ? 1 : 0);
				var range = new asc_Range(0, 0, this.cols.length - 1, h - 1);
				var j;
				for (j = rc; j > 0; --j, range.r1 += h, range.r2 += h) {
					if (j === 1 && rl % h > 0) {
						range.r2 = rl - 1;
					}
					s.push(range.clone());
				}
			},

			/**
			 * Обновляет общий кэш и кэширует метрики текста ячеек для указанного диапазона
			 * @param {Asc.Range} range  Диапазон кэширования текта
			 */
			_prepareCellTextMetricsCache: function (range) {
				var self = this, s = this.cache.sectors;

				if (s.length < 1) {return;}

				for (var i = 0; i < s.length; ) {
					if ( s[i].intersection(range) !== null ) {
						self._calcCellsTextMetrics(s[i]);
						s.splice(i, 1);
						continue;
					}
					++i;
				}
			},

			/**
			 * Кэширует метрики текста для диапазона ячеек
			 * @param {Asc.Range} range  description
			 */
			_calcCellsTextMetrics: function (range) {
				if (range === undefined) {
					range = asc_Range(0, 0, this.cols.length - 1, this.rows.length - 1);
				}
				for (var row = range.r1; row <= range.r2; ++row) {
					for (var col = range.c1; col <= range.c2; ++col) {
						col = this._addCellTextToCache(col, row);
					}
				}
				if (range.r1 <= range.r2) {
					this._updateRowPositions();
					this._calcVisibleRows();
				}
				this.isChanged = false;
			},

			_fetchRowCache: function (row) {
				var rc = this.cache.rows[row] = ( this.cache.rows[row] || new CacheElement() );
				return rc;
			},

			_fetchCellCache: function (col, row) {
				var r = this._fetchRowCache(row), c = r.columns[col] = ( r.columns[col] || {} );
				return c;
			},

			_fetchCellCacheText: function (col, row) {
				var r = this._fetchRowCache(row), cwt = r.columnsWithText[col] = ( r.columnsWithText[col] || {} );
				return cwt;
			},

			_getRowCache: function (row) {
				return this.cache.rows[row];
			},

			_getCellCache: function (col, row) {
				var r = this.cache.rows[row];
				return r ? r.columns[col] : undefined;
			},

			_getCellTextCache: function (col, row, dontLookupMergedCells) {
				var r = this.cache.rows[row], c = r ? r.columns[col] : undefined;
				if (c && c.text) {
					return c.text;
				} else if (!dontLookupMergedCells) {
					var range = this._getMergedCellsRange(col, row);
					return range !== undefined ? this._getCellTextCache(range.c1, range.r1, true) : undefined;
				}
				return undefined;
			},

			_addCellTextToCache: function (col, row, canChangeColWidth) {
				var self = this;

				function isFixedWidthCell(frag) {
					for (var i = 0; i < frag.length; ++i) {
						var f = frag[i].format;
						if (f && f.repeat) {return true;}
					}
					return false;
				}

				function truncFracPart(frag) {
					var s = frag.reduce(function (prev,val) {return prev + val.text;}, "");
					// Проверка scientific format
					if (s.search(/E/i) >= 0) {
						return frag;
					}
					// Поиск десятичной точки
					var pos = s.search(/[,\.]/);
					if (pos >= 0) {
						frag[0].text = s.slice(0, pos);
						frag.splice(1, frag.length - 1);
					}
					return frag;
				}

				function makeFnIsGoodNumFormat(flags, width) {
					return function (str) {
						return self.stringRender.measureString(str, flags, width).width <= width;
					};
				}

				function changeColWidth(col, width, pad) {
					var cc = Math.min(self._colWidthToCharCount(width + pad), /*max col width*/255);
					var modelw = self._charCountToModelColWidth(cc, true);
					var colw = self._calcColWidth(modelw);

					if (colw.width > self.cols[col].width) {
						self.cols[col].width = colw.width;
						self.cols[col].innerWidth = colw.innerWidth;
						self.cols[col].charCount = colw.charCount;

						History.Create_NewPoint();
						History.SetSelection(null, true);
						History.StartTransaction();
						// Выставляем ширину в модели
						self.model.setColWidth(modelw, col, col);
						// Выставляем, что это bestFit
						self.model.setColBestFit (true, col, col);
						History.EndTransaction();

						self._updateColumnPositions();
						self.isChanged = true;
					}
				}

				var c = this._getCell(col, row);
				if (c === undefined) {return col;}

				var bUpdateScrollX = false;
				var bUpdateScrollY = false;
				// Проверка на увеличение колличества столбцов
				if (col >= this.cols.length) {
					bUpdateScrollX = this.expandColsOnScroll(/*isNotActive*/ false, /*updateColsCount*/ true);
				}
				// Проверка на увеличение колличества строк
				if (row >= this.rows.length) {
					bUpdateScrollY = this.expandRowsOnScroll(/*isNotActive*/ false, /*updateRowsCount*/ true);
				}
				if (bUpdateScrollX && bUpdateScrollY) {
					this._trigger("reinitializeScroll");
				}
				else if (bUpdateScrollX) {
					this._trigger("reinitializeScrollX");
				}
				else if (bUpdateScrollY) {
					this._trigger("reinitializeScrollY");
				}

				// Range для замерженной ячейки
				var range = null;
				var fl = this._getCellFlags(c);
				var fMergedColumns = false;	// Замержены ли колонки (если да, то автоподбор ширины не должен работать)
				var fMergedRows = false;	// Замержены ли строки (если да, то автоподбор высоты не должен работать)
				if (fl.isMerged) {
					range = this._getMergedCellsRange(col, row);
					if (range === undefined) { // got uncached merged cells, redirect it
						range = this._fetchMergedCellsRange(col, row);
						this._addCellTextToCache(range.c1, range.r1, canChangeColWidth);
						return col;
					}
					if (col !== range.c1 || row !== range.r1) {return range.c2;} // skip other merged cell from range
					if (range.c1 !== range.c2)
						fMergedColumns = true;
					if (range.r1 !== range.r2)
						fMergedRows = true;
				}

				if (this._isCellEmpty(c)) {return col;}

				var dDigitsCount = 0;
				var colWidth = 0;
				var cellType = c.getType();
				var isNumberFormat = (!cellType || CellValueType.Number === cellType);
				var numFormatStr = c.getNumFormatStr();
				var pad = this.width_padding * 2 + this.width_1px;
				var sstr, sfl, stm;

				//TODO:
				//this.stringRender.setRotation(c.getAngle() || 0);

				if (!this.cols[col].isCustomWidth && isNumberFormat && !fMergedColumns &&
					(c_oAscCanChangeColWidth.numbers === canChangeColWidth ||
						c_oAscCanChangeColWidth.all === canChangeColWidth)) {
					colWidth = this.cols[col].innerWidth;
					// Измеряем целую часть числа
					sstr = c.getValue2(gc_nMaxDigCountView, function(){return true;});
					//todo убрать Asc.clone на другой clone или изменить truncFracPart, чтобы не изменяла исходный массив
					if ("General" === numFormatStr) {sstr = truncFracPart(Asc.clone(sstr));}
					sfl = asc_clone(fl);
					sfl.wrapText = false;
					stm = this._roundTextMetrics( this.stringRender.measureString(sstr, sfl, colWidth) );
					// Если целая часть числа не убирается в ячейку, то расширяем столбец
					if (stm.width > colWidth) {changeColWidth(col, stm.width, pad);}
					// Обновленная ячейка
					dDigitsCount = this.cols[col].charCount;
					colWidth = this.cols[col].innerWidth;
				} else if (null === range) {
					// Обычная ячейка
					dDigitsCount = this.cols[col].charCount;
					colWidth = this.cols[col].innerWidth;
					// подбираем ширину
					if (!this.cols[col].isCustomWidth && !fMergedColumns && !fl.wrapText &&
						c_oAscCanChangeColWidth.all === canChangeColWidth) {
						sstr = c.getValue2(gc_nMaxDigCountView, function(){return true;});
						stm = this._roundTextMetrics( this.stringRender.measureString(sstr, fl, colWidth) );
						if (stm.width > colWidth) {
							changeColWidth(col, stm.width, pad);
							// Обновленная ячейка
							dDigitsCount = this.cols[col].charCount;
							colWidth = this.cols[col].innerWidth;
						}
					}
				} else {
					// Замерженная ячейка, нужна сумма столбцов
					for (var i = range.c1; i <= range.c2 && i < this.nColsCount; ++i) {
						colWidth += this.cols[i].width;
					}
					colWidth -= pad;
					dDigitsCount = gc_nMaxDigCountView;
				}

				// ToDo dDigitsCount нужно рассчитывать исходя не из дефалтового шрифта и размера, а исходя из текущего шрифта и размера ячейки
				var str  = c.getValue2(dDigitsCount, makeFnIsGoodNumFormat(fl, colWidth));
				var ha   = c.getAlignHorizontalByValue().toLowerCase();
				var va   = c.getAlignVertical().toLowerCase();
				var maxW = fl.wrapText || fl.shrinkToFit || fl.isMerged || isFixedWidthCell(str) ? this._calcMaxWidth(col, row, fl.isMerged) : undefined;
				var tm   = this._roundTextMetrics( this.stringRender.measureString(str, fl, maxW) );
				var cto  = (fl.isMerged || fl.wrapText) ?
						{
							maxWidth:  maxW - this.cols[col].innerWidth + this.cols[col].width,
							leftSide: 0,
							rightSide: 0
						} :
						this._calcCellTextOffset(col, row, ha, tm.width);

				// check right side of cell text and append columns if it exceeds existing cells borders
				if (!fl.isMerged) {
					var rside = this.cols[col - cto.leftSide].left + tm.width;
					var lc    = this.cols[this.cols.length - 1];
					if (rside > lc.left + lc.width) {
						this._appendColumns(rside);
						cto = this._calcCellTextOffset(col, row, ha, tm.width);
					}
				}
				var oFontColor = c.getFontcolor();
				if(null != oFontColor)
					oFontColor = oFontColor.getRgb();
				this._fetchCellCache(col, row).text = {
					state   : this.stringRender.getInternalState(),
					flags   : fl,
					color   : (oFontColor || this.settings.cells.defaultState.color),
					metrics : tm,
					cellW   : cto.maxWidth,
					cellHA  : ha,
					cellVA  : va,
					sideL   : cto.leftSide,
					sideR   : cto.rightSide,
					cellType: cellType,
					isFormula: c.getFormula().length > 0,
					angle   : c.getAngle()
				};

				this._fetchCellCacheText(col, row).hasText = true;

				if (cto.leftSide !== 0 || cto.rightSide !== 0) {
					this._addErasedBordersToCache(col - cto.leftSide, col + cto.rightSide, row);
				}

				// update row's descender
				if (va !== kvaTop && va !== kvaCenter && !fl.isMerged) {
					this.rows[row].descender = Math.max(this.rows[row].descender, tm.height - tm.baseline);
				}

				// update row's height
				if (!this.rows[row].isCustomHeight) {
					// Замерженная ячейка (с 2-мя или более строками) не влияет на высоту строк!
					if (!fMergedRows) {
						this.rows[row].height = Math.min(this.maxRowHeight, Math.max(this.rows[row].height, tm.height));
						if (!this.rows[row].isDefaultHeight) {
							this.model.setRowHeight(this.rows[row].height + this.height_1px, row, row);
						}
						this.isChanged = true;
					}
				}

				//TODO:
				//this.stringRender.setRotation(0);

				return col;
			},

			_calcMaxWidth: function (col, row, isMerged) {
				if (!isMerged) {return this.cols[col].innerWidth;}

				var range = this._getMergedCellsRange(col, row),
				width = this.cols[range.c1].innerWidth;
				for (var c = range.c1 + 1; c <= range.c2 && c < this.nColsCount; ++c) {
					width += this.cols[c].width;
				}
				return width;
			},

			_calcCellTextOffset: function (col, row, textAlign, textWidth) {
				var sideL = [0], sideR = [0], i;
				var maxWidth = this.cols[col].width;
				var ls = 0, rs = 0;
				var pad = this.settings.cells.padding * asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
				var textW = textAlign === khaCenter ? (textWidth + maxWidth) * 0.5 : textWidth + pad;

				if (textAlign === khaRight || textAlign === khaCenter) {
					sideL = this._calcCellsWidth(col, 0, row);
					// condition (sideL.lenght >= 1) is always true
					for (i = 0; i < sideL.length && textW > sideL[i]; ++i) {/* do nothing */}
					ls = i !== sideL.length ? i : i - 1;
				}

				if (textAlign !== khaRight) {
					sideR = this._calcCellsWidth(col, this.cols.length - 1, row);
					// condition (sideR.lenght >= 1) is always true
					for (i = 0; i < sideR.length && textW > sideR[i]; ++i) {/* do nothing */}
					rs = i !== sideR.length ? i : i - 1;
				}

				if (textAlign === khaCenter) {
					maxWidth = (sideL[ls] - sideL[0]) + sideR[rs];
				} else {
					maxWidth = textAlign === khaRight ? sideL[ls] : sideR[rs];
				}

				return {
					maxWidth:  maxWidth,
					leftSide:  ls,
					rightSide: rs
				};
			},

			_calcCellsWidth: function (colBeg, colEnd, row) {
				var inc = colBeg <= colEnd ? 1 : -1, res = [];
				for (var i = colBeg; (colEnd - i) * inc >= 0; i += inc) {
					if ( i !== colBeg && !this._isCellEmptyOrMerged(i, row) ) {break;}
					res.push(this.cols[i].width);
					if (res.length > 1) {res[res.length - 1] += res[res.length - 2];}
				}
				return res;
			},

			// Ищет текст в строке (columnsWithText - это колонки, в которых есть текст)
			_findSourceOfCellText: function (col, row) {
				var r = this._getRowCache(row);
				if (r) {
					for (var i in r.columnsWithText) {
						if (!r.columns[i] || 0 === this.cols[i].width) {continue;}
						var ct = r.columns[i].text;
						if (!ct) {continue;}
						i = parseInt(i);
						var lc = i - ct.sideL,
							rc = i + ct.sideR;
						if (col >= lc && col <= rc) {return i;}
					}
				}
				return -1;
			},


			// ----- Merged cells cache -----

			_getMergedCellIndex: function (col, row) {
				return row + "-" + col;
			},

			_getMergedCellsRange: function (col, row) {
				var index = this._getMergedCellIndex(col, row);
				var rangeId = this.cache.mergedCells.index[index];
				return rangeId !== undefined ? this.cache.mergedCells.ranges[rangeId] : undefined;
			},

			_fetchMergedCellsRange: function (col, row) {
				var index, rangeId, mc = this._getMergedCellsRange(col, row);
				if (mc) {return mc;}

				this._addMergedCellsRange(col, row);
				index = this._getMergedCellIndex(col, row);
				rangeId = this.cache.mergedCells.index[index];
				if (rangeId === undefined) {
					throw "Error: can not get merged cell range (col=" + col + ", row=" + row + ")";
				}
				return this.cache.mergedCells.ranges[rangeId];
			},

			_addMergedCellsRange: function (col, row) {
				var range = this._getCell(col, row).hasMerged(), rangeId, c, r;
				this.cache.mergedCells.ranges.push( asc_Range(range.c1, range.r1, range.c2, range.r2) );
				rangeId = this.cache.mergedCells.ranges.length - 1;
				for (r = range.r1; r <= range.r2 && r < this.nRowsCount; ++r) {
					for (c = range.c1; c <= range.c2 && c < this.nColsCount; ++c) {
						this.cache.mergedCells.index[ this._getMergedCellIndex(c, r) ] = rangeId;
					}
				}
			},

			_isMergedCells: function (range) {
				return range.isEqual( this._getMergedCellsRange(range.c1, range.r1) );
			},

			// Обновляем массив мерженных индексов для новых строк
			_updateMergedCellsRange: function (updateRange) {
				for (var key in this.cache.mergedCells.ranges) {
					var tmpRange = this.cache.mergedCells.ranges[key];
					var bIsUpdate = false;
					var _r = tmpRange.r1, _c = tmpRange.c1;
					if (tmpRange.c1 < updateRange.c1 && tmpRange.c2 > updateRange.c2) {
						bIsUpdate = true;
						_c = updateRange.c1;
					}
					if (tmpRange.r1 < updateRange.r1 && tmpRange.r2 > updateRange.r2) {
						bIsUpdate = true;
						_r = updateRange.r1;
					}

					if (bIsUpdate) {
						for (var r = _r; r <= tmpRange.r2 && r < this.nRowsCount; ++r) {
							for (var c = _c; c <= tmpRange.c2 && c < this.nColsCount; ++c) {
								this.cache.mergedCells.index[ this._getMergedCellIndex(c, r) ] = key;
							}
						}
					}
				}
			},


			// ----- Cell borders cache -----

			_addErasedBordersToCache: function (colBeg, colEnd, row) {
				var rc = this._fetchRowCache(row);
				for (var col = colBeg; col < colEnd; ++col) {
					rc.erasedRB[col] = true;
					rc.erasedLB[col + 1] = true;
				}
			},

			_isLeftBorderErased: function (col, row) {
				return this._fetchRowCache(row).erasedLB[col] === true;
			},

			_isRightBorderErased: function (col, row) {
				return this._fetchRowCache(row).erasedRB[col] === true;
			},

			_getBorderPropById: function (border, border_id) {
				var border_prop = undefined;
				switch (border_id) {
					case kcbidLeft:
						border_prop = border.l;
						break;

					case kcbidRight:
						border_prop = border.r;
						break;

					case kcbidTop:
						border_prop = border.t;
						break;

					case kcbidBottom:
						border_prop = border.b;
						break;

					case kcbidDiagonal:
						border_prop = border.d;
						break;

					case kcbidDiagonalDown:
						border_prop = border.dd;
						break;

					case kcbidDiagonalUp:
						border_prop = border.du;
						break;
				}
				return border_prop;
			},

			_getBordersCache: function (col, row) {
				var self = this;

				if(col < 0 || row < 0) {
					return {
						l: new CellBorder(),
						r: new CellBorder(),
						t: new CellBorder(),
						b: new CellBorder(),
						dd: new CellBorder(),
						du: new CellBorder()
					};
				}

				function makeBorder(border, type, isActive) {
					return new CellBorder(
							self._getBorderPropById( border, type ).s,
							self._getBorderPropById( border, type ).c,
							self._calcBorderWidth( self._getBorderPropById( border, type ) ),
							type === kcbidLeft ? self._isLeftBorderErased(col, row) : (type === kcbidRight ?
									self._isRightBorderErased(col, row) : false),
							isActive !== undefined ? isActive : false);
				}

				var cc = self._fetchCellCache(col, row),
				cb = cc.borders = ( cc.borders || {} ),
				mc = this._getMergedCellsRange(col, row);

				if (!cb.l || !cb.r || !cb.t || !cb.b || !cb.dd || !cb.du) {
					var b = self._getVisibleCell(col, row).getBorder();
					if (!cb.l) {cb.l = !mc || col === mc.c1 ? makeBorder(b, kcbidLeft) : new CellBorder();}
					if (!cb.r) {cb.r = !mc || col === mc.c2 ? makeBorder(b, kcbidRight) : new CellBorder();}
					if (!cb.t) {cb.t = !mc || row === mc.r1 ? makeBorder(b, kcbidTop) : new CellBorder();}
					if (!cb.b) {cb.b = !mc || row === mc.r2 ? makeBorder(b, kcbidBottom) : new CellBorder();}
					if (!cb.dd) {
						cb.dd = !mc || col === mc.c1 && row === mc.r1 ? makeBorder(b, kcbidDiagonal, true) : new CellBorder();
						if (!b.dd) {cb.dd.w = 0;}
					}
					if (!cb.du) {
						cb.du = !mc || col === mc.c1 && row === mc.r1 ? makeBorder(b, kcbidDiagonal, true) : new CellBorder();
						if (!b.du) {cb.du.w = 0;}
					}
				}
				return cb;
			},

			_getActiveBorder: function (col, row, type) {
				var bor = this._getBordersCache(col, row);
				var border = this._getBorderPropById(bor, type);

				function calcActiveBorder(prev, next) {
					var ab = next && (next.s !== kcbNone || !prev) ? next : prev;
					if (prev && prev !== ab) {
						prev.s = ab.s;
						prev.c = ab.c;
						prev.w = ab.w;
						prev.isActive = true;
					}
					if (next && next !== ab) {
						next.s = ab.s;
						next.c = ab.c;
						next.w = ab.w;
						next.isActive = true;
					}
					ab.isActive = true;
					return ab;
				}

				if (!border.isActive && !border.isErased) {
					var side = undefined;
					switch (type) {
						case kcbidLeft:
							side = this._getBordersCache(col - 1, row).r;
							calcActiveBorder(side, bor.l);
							break;
						case kcbidRight:
							side = this._getBordersCache(col + 1, row).l;
							calcActiveBorder(bor.r, side);
							break;
						case kcbidTop:
							side = this._getBordersCache(col, row - 1).b;
							calcActiveBorder(side, bor.t);
							break;
						case kcbidBottom:
							side = this._getBordersCache(col, row + 1).t;
							calcActiveBorder(bor.b, side);
							break;
					}
				}

				return this._getBorderPropById(bor, type);
			},

			_calcMaxBorderWidth: function (b1, b2) {
				return Math.max(b1.isErased ? 0 : b1.w, b2.isErased ? 0 : b2.w);
			},


			// ----- Cells utilities -----

			/**
			 * Возвращает заголовок колонки по индексу
			 * @param {Number} col  Индекс колонки
			 * @return {String}
			 */
			_getColumnTitle: function (col) {
				var q = col < 26 ? undefined : asc_floor(col / 26) - 1;
				var r = col % 26;
				var text = String.fromCharCode( ("A").charCodeAt(0) + r );
				return col < 26 ? text : this._getColumnTitle(q) + text;
			},

			/**
			 * Возвращает заголовок строки по индексу
			 * @param {Number} row  Индекс строки
			 * @return {String}
			 */
			_getRowTitle: function (row) {
				return "" + (row + 1);
			},

			/**
			 * Возвращает заголовок ячейки по индексу
			 * @param {Number} col  Индекс колонки
			 * @param {Number} row  Индекс строки
			 * @return {String}
			 */
			_getCellTitle: function (col, row) {
				return this._getColumnTitle(col) + this._getRowTitle(row);
			},

			/**
			 * Возвращает ячейку таблицы (из Worksheet)
			 * @param {Number} col  Индекс колонки
			 * @param {Number} row  Индекс строки
			 * @return {Range}
			 */
			_getCell: function (col, row) {
				this.nRowsCount = Math.max(this.model.getRowsCount() , this.rows.length);
				this.nColsCount = Math.max(this.model.getColsCount(), this.cols.length);
				if ( col < 0 || col >= this.nColsCount || row < 0 || row >= this.nRowsCount ) {
					return undefined;
				}
				return this.model.getCell3(row, col);
			},

			_getVisibleCell: function (col, row) {
				return this.model.getCell3(row, col);
			},

			_getCellFlags: function (col, row) {
				var c = row !== undefined ? this._getCell(col, row) : col;
				var fl = {wrapText: false, shrinkToFit: false, isMerged: false, textAlign: kcbNone};
				if (c !== undefined) {
					fl.wrapText = c.getWrap();
					fl.shrinkToFit = c.getShrinkToFit();
					fl.isMerged = c.hasMerged() !== null;
					fl.textAlign = c.getAlignHorizontalByValue().toLowerCase();
				}
				return fl;
			},

			_isCellEmpty: function (col, row) {
				var c = row !== undefined ? this._getCell(col, row) : col;
				return c === undefined || c.getValue().search(/[^ ]/) < 0;
			},

			_isCellEmptyOrMerged: function (col, row) {
				var c = row !== undefined ? this._getCell(col, row) : col;
				if (undefined === c)
					return true;
				var fl = this._getCellFlags(c);
				if (fl.isMerged)
					return false;
				return c.getValue().search(/[^ ]/) < 0;
			},

			_isCellEmptyOrMergedOrBackgroundColorOrBorders: function (col, row) {
				var c = row !== undefined ? this._getCell(col, row) : col;
				if (undefined === c)
					return true;
				var fl = this._getCellFlags(c);
				if (fl.isMerged)
					return false;
				var bg = c.getFill();
				if (null !== bg)
					return false;
				var cb = c.getBorder();
				if ((cb.l && kcbNone !== cb.l.s) || (cb.r && kcbNone !== cb.r.s) || (cb.t && kcbNone !== cb.t.s) ||
					(cb.b && kcbNone !== cb.b.s) || (cb.dd && kcbNone !== cb.dd.s)  || (cb.du && kcbNone !== cb.du.s))
					return false;
				return c.getValue().search(/[^ ]/) < 0;
			},

			_isThinBorder: function (bs) {
				return $.inArray(bs, kcbThinBorders) >= 0;
			},

			_isMediumBorder: function (bs) {
				return $.inArray(bs, kcbMediumBorders) >= 0;
			},

			_isThickBorder: function (bs) {
				return $.inArray(bs, kcbThickBorders) >= 0;
			},

			_calcBorderWidth: function (b) {
				var s = b.s;
				return b === undefined ? 0 : (
						this._isThinBorder(s) ? 1 : (
						this._isMediumBorder(s) ? 2 : (
						this._isThickBorder(s) ? 3 : 0)));
			},

			_getRange: function (c1, r1, c2, r2) {
				return this.model.getRange3(r1, c1, r2, c2);
			},

			_selectColumnsByRange: function () {
				var ar = this.activeRange;
				if (c_oAscSelectionType.RangeMax === ar.type)
					return;
				else {
					this.cleanSelection();
					if (c_oAscSelectionType.RangeRow === ar.type) {
						ar.assign(0, 0, this.cols.length - 1, this.rows.length - 1);
						ar.type = c_oAscSelectionType.RangeMax;
					}
					else {
						ar.type = c_oAscSelectionType.RangeCol;
						ar.assign(ar.c1, 0, ar.c2, this.rows.length - 1);
					}
					this._drawSelection();
				}
			},

			_selectRowsByRange: function () {
				var ar = this.activeRange;
				if (c_oAscSelectionType.RangeMax === ar.type)
					return;
				else {
					this.cleanSelection();

					if (c_oAscSelectionType.RangeCol === ar.type) {
						ar.assign(0, 0, this.cols.length - 1, this.rows.length - 1);
						ar.type = c_oAscSelectionType.RangeMax;
					}
					else {
						ar.type = c_oAscSelectionType.RangeRow;
						ar.assign(0, ar.r1, this.cols.length - 1, ar.r2);
					}

					this._drawSelection();
				}
			},

			/**
			 * Возвращает true, если диапазон больше видимой области, и операции над ним могут привести к задержкам
			 * @param {Asc.Range} range  Диапазон для проверки
			 * @returns {Boolean}
			 */
			_isLargeRange: function (range) {
				var vr = this.visibleRange;
				return range.c2 - range.c1 + 1 > (vr.c2 - vr.c1 + 1) * 3 ||
						range.r2 - range.r1 + 1 > (vr.r2 - vr.r1 + 1) * 3;
			},

			/**
			 * Возвращает true, если диапазон состоит из одной ячейки
			 * @param {Asc.Range} range  Диапазон
			 * @returns {Boolean}
			 */
			_rangeIsSingleCell: function (range) {
				return range.c1 === range.c2 && range.r1 === range.r2;
			},

			drawDepCells : function(){
				var ctx = this.overlayCtx,
					_cc = this.cellCommentator,
					c,node, that = this;
				
				ctx.clear();
				this._drawSelection();

				function draw_arrow(context, fromx, fromy, tox, toy) {
					var headlen = 9,
						showArrow = tox > that.getCellLeft(0, 0) && toy > that.getCellTop(0, 0),
						dx = tox - fromx,
						dy = toy - fromy,
						tox = tox > that.getCellLeft(0, 0)? tox: that.getCellLeft(0, 0),
						toy = toy > that.getCellTop(0, 0)? toy: that.getCellTop(0, 0),
						angle = Math.atan2(dy, dx),
						_a = Math.PI / 18;
						
					context.save()
						.setLineWidth(1)
						.beginPath()
						.moveTo(_cc.pxToPt(fromx), _cc.pxToPt(fromy),-0.5,-0.5)
						.lineTo(_cc.pxToPt(tox), _cc.pxToPt(toy),-0.5,-0.5)
						// .dashLine(_cc.pxToPt(fromx-.5), _cc.pxToPt(fromy-.5), _cc.pxToPt(tox-.5), _cc.pxToPt(toy-.5), 15, 5)
					if( showArrow )
						context
							.moveTo(
								_cc.pxToPt(tox - headlen * Math.cos(angle - _a)),
								_cc.pxToPt(toy - headlen * Math.sin(angle - _a)),-0.5,-0.5)
							.lineTo(_cc.pxToPt(tox), _cc.pxToPt(toy),-0.5,-0.5)
							.lineTo(
								_cc.pxToPt(tox - headlen * Math.cos(angle + _a)),
								_cc.pxToPt(toy - headlen * Math.sin(angle + _a)),-0.5,-0.5)
							.lineTo(
								_cc.pxToPt(tox - headlen * Math.cos(angle - _a)),
								_cc.pxToPt(toy - headlen * Math.sin(angle - _a)),-0.5,-0.5)
						
					context
						.setStrokeStyle("#0000FF")
						.setFillStyle("#0000FF")
						.stroke()
						.fill()
						.closePath()
						.restore();
				}
				function gCM(_this,col,row){
					var metrics = { top: 0, left: 0, width: 0, height: 0, result: false }; 	// px

					var fvr = _this.getFirstVisibleRow();
					var fvc = _this.getFirstVisibleCol();
					var mergedRange = _this._getMergedCellsRange(col, row);

					if (mergedRange && (fvc < mergedRange.c2) && (fvr < mergedRange.r2)) {

						var startCol = (mergedRange.c1 > fvc) ? mergedRange.c1 : fvc;
						var startRow = (mergedRange.r1 > fvr) ? mergedRange.r1 : fvr;

						metrics.top = _this.getCellTop(startRow, 0) - _this.getCellTop(fvr, 0) + _this.getCellTop(0, 0);
						metrics.left = _this.getCellLeft(startCol, 0) - _this.getCellLeft(fvc, 0) + _this.getCellLeft(0, 0);

						for (var i = startCol; i <= mergedRange.c2; i++) {
							metrics.width += _this.getColumnWidth(i, 0)
						}
						for (var i = startRow; i <= mergedRange.r2; i++) {
							metrics.height += _this.getRowHeight(i, 0)
						}
						metrics.result = true;
					}
					else{

						metrics.top = _this.getCellTop(row, 0) - _this.getCellTop(fvr, 0) + _this.getCellTop(0, 0);
						metrics.left = _this.getCellLeft(col, 0) - _this.getCellLeft(fvc, 0) + _this.getCellLeft(0, 0);
						metrics.width = _this.getColumnWidth(col, 0);
						metrics.height = _this.getRowHeight(row, 0);
						metrics.result = true;
					}
			
					return metrics
				}

				for(var id in this.depDrawCells ){
					c = this.depDrawCells[id].from;
					node = this.depDrawCells[id].to;
					var mainCellMetrics = gCM(this,c.getCellAddress().getCol0(),c.getCellAddress().getRow0()), nodeCellMetrics,
						_t1, _t2;
					for(var id in node){
						if( !node[id].isArea ){
							_t1 = gCM(this,node[id].returnCell().getCellAddress().getCol0(),node[id].returnCell().getCellAddress().getRow0())
							nodeCellMetrics = { t: _t1.top, l: _t1.left, w: _t1.width, h: _t1.height, apt: _t1.top+_t1.height/2, apl: _t1.left+_t1.width/4};
						}
						else{
							var _t1 = gCM(_wsV,me[id].firstCellAddress.getCol0(),me[id].firstCellAddress.getRow0()),
							_t2 = gCM(_wsV,me[id].lastCellAddress.getCol0(),me[id].lastCellAddress.getRow0());
					
							nodeCellMetrics = { t: _t1.top, l: _t1.left, w: _t2.left+_t2.width-_t1.left, h: _t2.top+_t2.height-_t1.top,
												apt: _t1.top+_t1.height/2, apl:_t1.left+_t1.width/4  };
						}
						
						var x1 = Math.floor(nodeCellMetrics.apl),
							y1 = Math.floor(nodeCellMetrics.apt),
							x2 = Math.floor(mainCellMetrics.left+mainCellMetrics.width/4),
							y2 = Math.floor(mainCellMetrics.top+mainCellMetrics.height/2);
						
						if( x1<0 && x2<0 || y1<0 && y2<0)
							continue;
						
						if(y1<this.getCellTop(0, 0))
							y1-=this.getCellTop(0, 0);
						
						if(y1<0 && y2>0){
							var _x1 = Math.floor(Math.sqrt((x1-x2)*(x1-x2)*y1*y1/((y2-y1)*(y2-y1))));
							// x1 -= (x1-x2>0?1:-1)*_x1;
							if( x1 > x2){
								x1 -= _x1;
							}
							else if( x1 < x2 ){
								x1 += _x1;
							}
						}
						else if(y1>0 && y2<0){
							var _x2 = Math.floor(Math.sqrt((x1-x2)*(x1-x2)*y2*y2/((y2-y1)*(y2-y1))));
							// x2 -= (x2-x1>0?1:-1)*_x2;
							if( x2 > x1){
								x2 -= _x2;
							}
							else if( x2 < x1){
								x2 += _x2;
							}
						}
						
						if(x1<0 && x2>0){
							var _y1 = Math.floor(Math.sqrt((y1-y2)*(y1-y2)*x1*x1/((x2-x1)*(x2-x1))))
							// y1 -= (y1-y2>0?1:-1)*_y1;
							if( y1 > y2){
								y1 -= _y1;
							}
							else if( y1 < y2 ){
								y1 += _y1;
							}
						}
						else if(x1>0 && x2<0){
							var _y2 = Math.floor(Math.sqrt((y1-y2)*(y1-y2)*x2*x2/((x2-x1)*(x2-x1))))
							// y2 -= (y2-y1>0?1:-1)*_y2;
							if( y2 > y1 ){
								y2 -= _y2;
							}
							else if( y2 < y1 ){
								y2 += _y2;
							}
						}
						
						draw_arrow(ctx, x1<this.getCellLeft(0, 0)?this.getCellLeft(0, 0):x1, y1<this.getCellTop(0, 0)?this.getCellTop(0, 0):y1, x2, y2);
						// draw_arrow(ctx, x1, y1, x2, y2);
						
						if( nodeCellMetrics.apl > this.getCellLeft(0, 0) && nodeCellMetrics.apt > this.getCellTop(0, 0) )
							ctx.save()
								.beginPath()
								.arc(_cc.pxToPt(Math.floor(nodeCellMetrics.apl)),
									_cc.pxToPt(Math.floor(nodeCellMetrics.apt)),
									3,0, 2 * Math.PI, false,-0.5,-0.5)
								.setFillStyle("#0000FF")
								.fill()
								.closePath()
								.setLineWidth(1)
								.setStrokeStyle("#0000FF")
								.rect( _cc.pxToPt(nodeCellMetrics.l),_cc.pxToPt(nodeCellMetrics.t),_cc.pxToPt(nodeCellMetrics.w-1),_cc.pxToPt(nodeCellMetrics.h-1), -.5, -.5 )
								.stroke()
								.restore();
					}
				}
				
			},
			
			prepareDepCells: function(se){
				var activeCell = this.activeRange,
					mc = this._getMergedCellsRange(activeCell.startCol, activeCell.startRow),
					c1 = mc ? mc.c1 : activeCell.startCol,
					r1 = mc ? mc.r1 : activeCell.startRow,
					c = this._getVisibleCell(c1, r1),
					nodes = (se == c_oAscDrawDepOptions.Master) ? this.model.workbook.dependencyFormulas.getMasterNodes(this.model.getId(),c.getName()) : this.model.workbook.dependencyFormulas.getSlaveNodes(this.model.getId(),c.getName());
				
				if(!nodes)
					return;
				
				if( !this.depDrawCells )
					this.depDrawCells = {};
				
				if(se == c_oAscDrawDepOptions.Master){
					c = c.getCells()[0];
					var id = getVertexId(this.model.getId(),c.getName());
					this.depDrawCells[id] = {from:c,to:nodes};
				}
				else{
					var to = {}, to1,
						id = getVertexId(this.model.getId(),c.getName());
						to[getVertexId(this.model.getId(),c.getName())]= this.model.workbook.dependencyFormulas.getNode(this.model.getId(),c.getName());
						to1 = this.model.workbook.dependencyFormulas.getNode(this.model.getId(),c.getName());
					for(var id2 in nodes){
						if( this.depDrawCells[id2] )
							$.extend(this.depDrawCells[id2].to,to)
						else{
							this.depDrawCells[id2] = {}
							this.depDrawCells[id2].from = nodes[id2].returnCell()
							this.depDrawCells[id2].to = {}
							this.depDrawCells[id2].to[id] = to1;
						}
					}
				}
				this.drawDepCells();
				
			},
			
			cleanDepCells: function(){
				this.depDrawCells = null;
				this.drawDepCells();
			},
			
			// ----- Text drawing -----

			_getPPIX: function () {
				return this.drawingCtx.getPPIX();
			},

			_getPPIY: function () {
				return this.drawingCtx.getPPIY();
			},

			_setFont: function (drawingCtx, name, size) {
				var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
				ctx.setFont( new asc_FP(name, size) );
			},

			/**
			 * @param {TextMetrics} tm
			 * @return {TextMetrics}
			 */
			_roundTextMetrics: function (tm) {
				tm.width    = asc_calcnpt( tm.width, this._getPPIX() );
				tm.height   = asc_calcnpt( tm.height, this._getPPIY() );
				tm.baseline = asc_calcnpt( tm.baseline, this._getPPIY() );
				if (tm.centerline !== undefined) {
					tm.centerline = asc_calcnpt( tm.centerline, this._getPPIY() );
				}
				return tm;
			},

			_calcTextHorizPos: function (x1, x2, tm, halign) {
				switch (halign) {
					case khaCenter:
						return asc_calcnpt(0.5 * (x1 + x2 + this.width_1px - tm.width), this._getPPIX());
					case khaRight:
						return x2 + this.width_1px - this.width_padding - tm.width;
					case khaJustify:
					default:
						return x1 + this.width_padding;
				}
			},

			_calcTextVertPos: function (y1, y2, baseline, tm, valign) {
				switch (valign) {
					case kvaCenter:
						return asc_calcnpt(0.5 * (y1 + y2 - tm.height), this._getPPIY()) - this.height_1px;
					case kvaTop:
						return y1 - this.height_1px;
					default:
						return baseline - tm.baseline;
				}
			},

			_calcTextWidth: function (x1, x2, tm, halign) {
				switch (halign) {
					case khaJustify:
						return x2 + this.width_1px - this.width_padding * 2 - x1;
					default:
						return tm.width;
				}
			},


			// ----- Events processing -----

			_trigger: function (eventName) {
				var f = this.settings[eventName];
				return f && asc_typeof(f) === "function" ?
						f.apply( this, Array.prototype.slice.call(arguments, 1) ) :
						undefined;
			},


			// ----- Scrolling -----

			_calcCellPosition: function (c, r, dc, dr) {
				var t = this;
				var vr = t.visibleRange;

				function findNextCell(col, row, dx, dy) {
					var state = t._isCellEmpty(col, row);
					var i = col + dx;
					var j = row + dy;
					while (i >= 0 && i < t.cols.length && j >= 0 && j < t.rows.length) {
						var newState = t._isCellEmpty(i, j);
						if (newState !== state) {
							var ret = {};
							ret.col = state ? i : i - dx;
							ret.row = state ? j : j - dy;
							if (ret.col !== col || ret.row !== row || state) { return ret; }
							state = newState;
						}
						i += dx;
						j += dy;
					}
					// Проверки для перехода в самый конец (ToDo пока убрал, чтобы не добавлять тормозов)
					/*if (i === t.cols.length && state)
						i = gc_nMaxCol;
					if (j === t.rows.length && state)
						j = gc_nMaxRow;*/
					return { col: i - dx, row: j- dy };
				}

				function findEnd(col, row) {
					var nc1, nc2 = col;
					do {
						nc1 = nc2;
						nc2 = findNextCell(nc1, row, +1, 0).col;
					} while (nc1 !== nc2);
					return nc2;
				}

				function findEOT() {
					var obr = t.objectRender.getDrawingAreaMetrics() || {maxCol: 0, maxRow: 0};
					var maxCols = t.model.getColsCount();
					var maxRows = t.model.getRowsCount();
					var lastC = -1, lastR = -1;

					for (var col = 0; col < maxCols; ++col) {
						for (var row = 0; row < maxRows; ++row) {
							if (!t._isCellEmpty(col, row)) {
								lastC = Math.max(lastC, col);
								lastR = Math.max(lastR, row);
							}
						}
					}
					return {col: Math.max(lastC, obr.maxCol), row: Math.max(lastR, obr.maxRow)};
				}

				var eot = dc > +2.0001 && dc < +2.9999 && dr > +2.0001 && dr < +2.9999 ? findEOT() : null;

				var newCol = (function () {
					if (dc > +0.0001 && dc < +0.9999) { return c + (vr.c2 - vr.c1 + 1); }        // PageDown
					if (dc < -0.0001 && dc > -0.9999) { return c - (vr.c2 - vr.c1 + 1); }        // PageUp
					if (dc > +1.0001 && dc < +1.9999) { return findNextCell(c, r, +1, 0).col; }  // Ctrl + ->
					if (dc < -1.0001 && dc > -1.9999) { return findNextCell(c, r, -1, 0).col; }  // Ctrl + <-
					if (dc > +2.0001 && dc < +2.9999) { return !eot ? findEnd(c,r) : eot.col; }  // End
					if (dc < -2.0001 && dc > -2.9999) { return 0; }                              // Home
					return c + dc;
				})();
				var newRow = (function () {
					if (dr > +0.0001 && dr < +0.9999) { return r + (vr.r2 - vr.r1 + 1); }
					if (dr < -0.0001 && dr > -0.9999) { return r - (vr.r2 - vr.r1 + 1); }
					if (dr > +1.0001 && dr < +1.9999) { return findNextCell(c, r, 0, +1).row; }
					if (dr < -1.0001 && dr > -1.9999) { return findNextCell(c, r, 0, -1).row; }
					if (dr > +2.0001 && dr < +2.9999) { return !eot ? 0 : eot.row; }
					if (dr < -2.0001 && dr > -2.9999) { return 0; }
					return r + dr;
				})();

				if (newCol >= t.cols.length && newCol <= gc_nMaxCol0) {
					t.nColsCount = newCol + 1;
					t._updateMergedCellsRange(asc_Range(t.cols.length - 1, 0, t.nColsCount - 1, t.nRowsCount));
					t._calcColumnWidths(/*fullRecalc*/2);
				}
				if (newRow >= t.rows.length && newRow <= gc_nMaxRow0) {
					t.nRowsCount = newRow + 1;
					t._updateMergedCellsRange(asc_Range(0, t.rows.length - 1, t.nColsCount, t.nRowsCount - 1));
					t._calcRowHeights(/*fullRecalc*/2);
				}

				return {
					col: newCol < 0 ? 0 : Math.min(newCol, t.cols.length - 1),
					row: newRow < 0 ? 0 : Math.min(newRow, t.rows.length - 1)
				};
			},

			_isColDrawnPartially: function (col, leftCol) {
				if (col <= leftCol)
					return false;
				var c = this.cols;
				return c[col].left + c[col].width - c[leftCol].left + this.cellsLeft > this.drawingCtx.getWidth();
			},

			_isRowDrawnPartially: function (row, topRow) {
				if (row <= topRow)
					return false;
				var r = this.rows;
				return r[row].top + r[row].height - r[topRow].top + this.cellsTop > this.drawingCtx.getHeight();
			},

			_isVisibleX: function (x, leftCol) {
				var c = this.cols;
				return x - c[leftCol].left + this.cellsLeft < this.drawingCtx.getWidth();
			},

			_isVisibleY: function (y, topRow) {
				var r = this.rows;
				return y - r[topRow].top + this.cellsTop < this.drawingCtx.getHeight();
			},

			_updateVisibleRowsCount: function (skipScrolReinit) {
				var vr = this.visibleRange;
				this._calcVisibleRows();
				if ( this._isVisibleY(this.rows[vr.r2].top + this.rows[vr.r2].height, vr.r1) ) {
					do{  // Добавим еще строки, чтоб не было видно фон под таблицей
						this.expandRowsOnScroll(true);
						this._calcVisibleRows();
						if (this.rows[this.rows.length - 1].height < 0.000001) {break;}
					} while ( this._isVisibleY(this.rows[vr.r2].top + this.rows[vr.r2].height, vr.r1) );
					if (!skipScrolReinit) {
						this._trigger("reinitializeScrollY");
					}
				}
			},

			_updateVisibleColsCount: function (skipScrolReinit) {
				var vr = this.visibleRange;
				this._calcVisibleColumns();
				if ( this._isVisibleX(this.cols[vr.c2].left + this.cols[vr.c2].width, vr.c1) ) {
					do {  // Добавим еще столбцы, чтоб не было видно фон под таблицей
						this.expandColsOnScroll(true);
						this._calcVisibleColumns();
						if (this.cols[this.cols.length - 1].width < 0.000001) {break;}
					} while ( this._isVisibleX(this.cols[vr.c2].left + this.cols[vr.c2].width, vr.c1) );
					if (!skipScrolReinit) {
						this._trigger("reinitializeScrollX");
					}
				}
			},

			scrollVertical: function (delta, editor) {
				var vr = this.visibleRange;
				var start = this._calcCellPosition(vr.c1, vr.r1, 0, delta).row;

				if (start === vr.r1) {return this;}

				this.cleanSelection();

				var ctx = this.drawingCtx;
				var ctxW   = ctx.getWidth();
				var ctxH   = ctx.getHeight();
				var dy     = this.rows[start].top - this.rows[vr.r1].top;
				var oldEnd = vr.r2;
				var oldDec = Math.max(calcDecades(oldEnd + 1), 3);
				var oldVRE_isPartial = this._isRowDrawnPartially(vr.r2, vr.r1);

				if (this.isCellEditMode && editor) {editor.move(0, -dy);}

				vr.r1 = start;
				this._updateVisibleRowsCount();

				var oldH = ctxH - this.cellsTop - Math.abs(dy);
				var y    = this.cellsTop + (dy > 0 && oldH > 0 ? dy : 0);
				var oldW, x, dx;
				
				this.objectRender.setScrollOffset(0, dy * asc_getcvt(1, 0, this._getPPIX()) );

				var widthChanged = Math.max(calcDecades(vr.r2 + 1), 3) !== oldDec;
				if (widthChanged) {
					x = this.cellsLeft;
					this._calcHeaderColumnWidth();
					this._updateColumnPositions();
					this._calcVisibleColumns();
					this._drawCorner();
					this._cleanColumnHeadersRect();
					this._drawColumnHeaders(/*drawingCtx*/ undefined);
					dx   = this.cellsLeft - x;
					oldW = ctxW - x - Math.abs(dx);
				} else {
					dx   = 0;
					x    = this.headersLeft;
					oldW = ctxW;
				}

				if (oldH > 0) {
					ctx.drawImage(ctx.getCanvas(), x, y, oldW, oldH, x + dx, y - dy, oldW, oldH);
				}
				ctx.setFillStyle(this.settings.cells.defaultState.background)
						.fillRect(this.headersLeft, y + (dy > 0 && oldH > 0 ? oldH - dy : 0),
						          ctxW, ctxH - this.cellsTop - (oldH > 0 ? oldH : 0));

				if ( !(dy > 0 && vr.r2 === oldEnd && !oldVRE_isPartial && dx === 0) ) {
					var c1 = vr.c1;
					var r1 = dy > 0 && oldH > 0 ? oldEnd + (oldVRE_isPartial ? 0 : 1) : vr.r1;
					var c2 = vr.c2;
					var r2 = dy > 0 || oldH <= 0 ? vr.r2 : vr.r1 - 1 - delta; /* delta < 0 here */
					var range = asc_Range(c1, r1, c2, r2);
					if (dx === 0) {
						this._drawRowHeaders(/*drawingCtx*/ undefined, r1, r2);
					} else {
						// redraw all headres, because number of decades in row index has been changed
						this._drawRowHeaders(/*drawingCtx*/ undefined);
						if (dx < 0) {
							// draw last column
							var r1_ = dy > 0 ? vr.r1 : r2 + 1;
							var r2_ = dy > 0 ? r1 - 1 : vr.r2;
							var r_ = asc_Range(c2, r1_, c2, r2_);
							if (r2_ >= r1_) {
								this._drawGrid(/*drawingCtx*/ undefined, r_);
								this._drawCells(r_);
								this._drawCellsBorders(/*drawingCtx*/undefined, r_);
							}
						}
					}
					this._drawGrid(/*drawingCtx*/ undefined, range);
					this._drawCells(range);
					this._drawCellsBorders(/*drawingCtx*/undefined, range);
					this._fixSelectionOfMergedCells();
					this._drawSelection();

					if (widthChanged) {this._trigger("reinitializeScrollX");}
				}

				this.overlayCtx.clear();
				this._updateHyperlinksCache();
				this.cellCommentator.drawCommentCells(true);
				this.cellCommentator.updateCommentPosition();
				this.autoFilters.drawAutoF(this);
				this.drawDepCells();
				this.objectRender.showDrawingObjects(true);
				return this;
			},

			scrollHorizontal: function (delta, editor) {
				var vr = this.visibleRange;
				var start = this._calcCellPosition(vr.c1, vr.r1, delta, 0).col;

				if (start === vr.c1) {return this;}

				this.cleanSelection();

				var ctx = this.drawingCtx;
				var ctxW    = ctx.getWidth();
				var ctxH    = ctx.getHeight();
				var dx      = this.cols[start].left - this.cols[vr.c1].left;
				var oldEnd  = vr.c2;
				var oldVCE_isPartial = this._isColDrawnPartially(vr.c2, vr.c1);

				if (this.isCellEditMode && editor) {editor.move(-dx, 0);}

				vr.c1 = start;
				this._updateVisibleColsCount();
				
				this.objectRender.setScrollOffset( dx * asc_getcvt(1, 0, this._getPPIX()), 0 );

				var oldW = ctxW - this.cellsLeft - Math.abs(dx);
				var x = this.cellsLeft + (dx > 0 && oldW > 0 ? dx : 0);
				var y = this.headersTop;
				if (oldW > 0) {
					ctx.drawImage(ctx.getCanvas(), x, y, oldW, ctxH, x - dx, y, oldW, ctxH);
				}
				ctx.setFillStyle(this.settings.cells.defaultState.background)
						.fillRect(x + (dx > 0 && oldW > 0 ? oldW - dx : 0), y,
						          ctxW - this.cellsLeft - (oldW > 0 ? oldW : 0), ctxH);

				if ( !(dx > 0 && vr.c2 === oldEnd && !oldVCE_isPartial) ) {
					var c1 = dx > 0 && oldW > 0 ? oldEnd + (oldVCE_isPartial ? 0 : 1) : vr.c1;
					var r1 = vr.r1;
					var c2 = dx > 0 || oldW <= 0 ? vr.c2 : vr.c1 - 1 - delta; /* delta < 0 here */
					var r2 = vr.r2;
					var range = asc_Range(c1, r1, c2, r2);
					this._drawColumnHeaders(/*drawingCtx*/ undefined, c1, c2);
					this._drawGrid(/*drawingCtx*/ undefined, range);
					this._drawCells(range);
					this._drawCellsBorders(/*drawingCtx*/undefined, range);
					this._fixSelectionOfMergedCells();
					this._drawSelection();
				}
				
				this.overlayCtx.clear();
				this.cellCommentator.drawCommentCells(true);
				this.cellCommentator.updateCommentPosition();
				this._updateHyperlinksCache();
				this.autoFilters.drawAutoF(this);
				this.drawDepCells();
				this.objectRender.showDrawingObjects(true);
				return this;
			},
			
			// ----- Selection -----

			// dX = true - считать с половиной следующей ячейки
			_findColUnderCursor: function (x, canReturnNull, dX) {
				var c = this.visibleRange.c1;
				var offset = this.cols[c].left - this.cellsLeft;
				var c2, x1, x2;
				if (x >= this.cellsLeft) {
					for (x1 = this.cellsLeft, c2 = this.cols.length - 1; c <= c2; ++c, x1 = x2) {
						x2 = x1 + this.cols[c].width;
						if (x1 <= x && x < x2) {
							if (dX){
								// Учитываем половину ячейки
								if (x1 <= x && x < x1 + this.cols[c].width / 2.0){
									// Это предыдущая ячейка
									--c;
									// Можем вернуть и -1 (но это только для fillHandle)
								}
							}
							return {col: c, left: x1, right: x2};
						}
					}
					if (!canReturnNull) {return {col: c2, left: this.cols[c2].left - offset, right: x2};}
				} else {
					for (x2 = this.cellsLeft + this.cols[c].width, c2 = 0; c >= c2; --c, x2 = x1) {
						x1 = this.cols[c].left - offset;
						if (x1 <= x && x < x2) {
							if (dX){
								// Учитываем половину ячейки
								if (x1 <= x && x < x1 + this.cols[c].width / 2.0){
									// Это предыдущая ячейка
									--c;
									// Можем вернуть и -1 (но это только для fillHandle)
								}
							}
							return {col: c, left: x1, right: x2};
						}
					}
					if (!canReturnNull) {
						if (dX) {
							// Это предыдущая ячейка
							--c2;
							// Можем вернуть и -1 (но это только для fillHandle)
							return {col: c2};
						}
						return {col: c2, left: x1, right: x1 + this.cols[c2].width};
					}
				}
				return null;
			},

			// dY = true - считать с половиной следующей ячейки
			_findRowUnderCursor: function (y, canReturnNull, dY) {
				var r = this.visibleRange.r1,
				offset = this.rows[r].top - this.cellsTop,
				r2, y1, y2;
				if (y >= this.cellsTop) {
					for (y1 = this.cellsTop, r2 = this.rows.length - 1; r <= r2; ++r, y1 = y2) {
						y2 = y1 + this.rows[r].height;
						if (y1 <= y && y < y2) {
							if (dY){
								// Учитываем половину ячейки
								if (y1 <= y && y < y1 + this.rows[r].height / 2.0){
									// Это предыдущая ячейка
									--r;
									// Можем вернуть и -1 (но это только для fillHandle)
								}
							}
							return {row: r, top: y1, bottom: y2};
						}
					}
					if (!canReturnNull) {return {row: r2, top: this.rows[r2].top - offset, bottom: y2};}
				} else {
					for (y2 = this.cellsTop + this.rows[r].height, r2 = 0; r >= r2; --r, y2 = y1) {
						y1 = this.rows[r].top - offset;
						if (y1 <= y && y < y2) {
							if (dY){
								// Учитываем половину ячейки
								if (y1 <= y && y < y1 + this.rows[r].height / 2.0){
									// Это предыдущая ячейка
									--r;
									// Можем вернуть и -1 (но это только для fillHandle)
								}
							}
							return {row: r, top: y1, bottom: y2};
						}
					}
					if (!canReturnNull) {
						if (dY) {
							// Это предыдущая ячейка
							--r2;
							// Можем вернуть и -1 (но это только для fillHandle)
							return {row: r2};
						}
						return {row: r2, top: y1, bottom: y1 + this.rows[r2].height};
					}
				}
				return null;
			},

			getCursorTypeFromXY: function (x, y) {
				var c, r, f;
				var left, top, right, bottom;
				var sheetId = this.model.getId();
				var userId = undefined;
				var lockRangePosLeft = undefined;
				var lockRangePosTop = undefined;
				var lockInfo = undefined;
				var isLocked = false;
				
				if ( asc["editor"].isStartAddShape )
					return {cursor: kCurFillHandle, target: "shape", col: -1, row: -1};
				
				var drawingInfo = this.objectRender.checkCursorDrawingObject(x, y);
				if (drawingInfo && drawingInfo.cursor) {
					// Возможно картинка с lock
					lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object,/*subType*/null,
						sheetId, drawingInfo.data.id);
					isLocked = this.collaborativeEditing.getLockIntersection(lockInfo,
						c_oAscLockTypes.kLockTypeOther,/*bCheckOnlyLockAll*/false);
					if (false !== isLocked) {
						// Кто-то сделал lock
						userId = isLocked.UserId;
						lockRangePosLeft = drawingInfo.data.getVisibleLeftOffset(/*withHeader*/true);
						lockRangePosTop = drawingInfo.data.getVisibleTopOffset(/*withHeader*/true);
					}

					return {cursor: drawingInfo.cursor, target: "drawingObject", drawingId: drawingInfo.data.id, col: -1, row: -1, userId: userId,
						lockRangePosLeft: lockRangePosLeft, lockRangePosTop: lockRangePosTop};
				}
					
				var autoFilterCursor = this.autoFilters.isButtonAFClick(x,y,this);
				if(autoFilterCursor)
					return {cursor: autoFilterCursor, target: "aFilterObject", col: -1, row: -1};

				x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
				y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );
					
				if (this.isFormulaEditMode || this.isChartAreaEditMode)
				{
					var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
					var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
					var arr = this.isFormulaEditMode ? this.arrActiveFormulaRanges : this.arrActiveChartsRanges,
						targetArr = this.isFormulaEditMode ? 0 : -1;
					for (var i in arr) {
						var arFormulaTmp = arr[i].clone(true);
						var aFormulaIntersection = arFormulaTmp.intersection(this.visibleRange);
						
						if (aFormulaIntersection) {
							var drawLeftSideFormula   = aFormulaIntersection.c1 === arFormulaTmp.c1;
							var drawRightSideFormula  = aFormulaIntersection.c2 === arFormulaTmp.c2;
							var drawTopSideFormula    = aFormulaIntersection.r1 === arFormulaTmp.r1;
							var drawBottomSideFormula = aFormulaIntersection.r2 === arFormulaTmp.r2;

							var xFormula1 = this.cols[aFormulaIntersection.c1].left - offsetX;
							var xFormula2 = this.cols[aFormulaIntersection.c2].left + this.cols[aFormulaIntersection.c2].width - offsetX;
							var yFormula1 = this.rows[aFormulaIntersection.r1].top - offsetY;
							var yFormula2 = this.rows[aFormulaIntersection.r2].top + this.rows[aFormulaIntersection.r2].height - offsetY;
							
							if(
								(x >= xFormula1 + 5 && x <= xFormula2 - 5) && ((y >= yFormula1 - this.height_2px && y <= yFormula1 + this.height_2px) || (y >= yFormula2 - this.height_2px && y <= yFormula2 + this.height_2px))
								||
								(y >= yFormula1 + 5 && y <= yFormula2 - 5) && ((x >= xFormula1 - this.width_2px && x <= xFormula1 + this.width_2px) || (x >= xFormula2 - this.width_2px && x <= xFormula2 + this.width_2px))
							){
								return {cursor: kCurMove, target: "moveResizeRange",
												col: -1,
												row: -1,
												formulaRange: arFormulaTmp, indexFormulaRange:i,
												targetArr: targetArr};
							}
							else if( x >= xFormula1 && x < xFormula1 + 5 && y >= yFormula1 && y < yFormula1 + 5 ){
								return {cursor: kCurSEResize, target: "moveResizeRange",
												col: aFormulaIntersection.c2,
												row: aFormulaIntersection.r2, 
												formulaRange: arFormulaTmp, indexFormulaRange:i,
												targetArr: targetArr};
							}
							else if ( x > xFormula2 - 5 && x <= xFormula2 && y > yFormula2 - 5 && y <= yFormula2 ){
								return {cursor: kCurSEResize, target: "moveResizeRange",
												col: aFormulaIntersection.c1,
												row: aFormulaIntersection.r1, 
												formulaRange: arFormulaTmp, indexFormulaRange:i,
												targetArr: targetArr};
							}
							else if( x > xFormula2 - 5 && x <= xFormula2 && y >= yFormula1 && y < yFormula1 + 5 ){
								return {cursor: kCurNEResize, target: "moveResizeRange",
												col: aFormulaIntersection.c1,
												row: aFormulaIntersection.r2, 
												formulaRange: arFormulaTmp, indexFormulaRange:i,
												targetArr: targetArr};
							}
							else if( x >= xFormula1 && x < xFormula1 + 5 && y > yFormula2 - 5 && y <= yFormula2 ){
								return {cursor: kCurNEResize, target: "moveResizeRange",
												col: aFormulaIntersection.c2,
												row: aFormulaIntersection.r1, 
												formulaRange: arFormulaTmp, indexFormulaRange:i,
												targetArr: targetArr};
							}
						}
					}
				}
				
				do {
					// Эпсилон для fillHandle
					var fillHandleEpsilon = this.width_1px;
					if (x >= (this.fillHandleL - fillHandleEpsilon) && x <= (this.fillHandleR + fillHandleEpsilon) &&
						y >= (this.fillHandleT - fillHandleEpsilon) && y <= (this.fillHandleB + fillHandleEpsilon) && !this.isChartAreaEditMode) {
						// Мы на "квадрате" для автозаполнения
						return {cursor: kCurFillHandle, target: "fillhandle", col: -1, row: -1};
					}

					var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
					var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
					var xWithOffset = x + offsetX;
					var yWithOffset = y + offsetY;
					
					// Навели на выделение
					left = this.cols[this.activeRange.c1].left;
					right = this.cols[this.activeRange.c2].left + this.cols[this.activeRange.c2].width;
					top = this.rows[this.activeRange.r1].top;
					bottom = this.rows[this.activeRange.r2].top + this.rows[this.activeRange.r2].height;
					if ((((xWithOffset >= left - this.width_2px && xWithOffset <= left + this.width_2px) || (xWithOffset >= right - this.width_2px && xWithOffset <= right + this.width_2px)) && yWithOffset >= top - this.height_2px && yWithOffset <= bottom + this.height_2px) ||
						(((yWithOffset >= top - this.height_2px && yWithOffset <= top + this.height_2px) || (yWithOffset >= bottom - this.height_2px && yWithOffset <= bottom + this.height_2px)) && xWithOffset >= left - this.width_2px && xWithOffset <= right + this.width_2px)) {
						// Мы навели на границу выделения
						return {cursor: kCurMove, target: "moveRange", col: -1, row: -1};
					}

					if (x < this.cellsLeft && y < this.cellsTop) {
						return {cursor: kCurCorner, target: "corner", col: -1, row: -1};
					}

					if (x > this.cellsLeft && y > this.cellsTop) {
						c = this._findColUnderCursor(x, true);
						r = this._findRowUnderCursor(y, true);
						if (c === null || r === null) {break;}

						// Проверка на совместное редактирование
						var lockRange = undefined;
						var lockAllPosLeft = undefined;
						var lockAllPosTop = undefined;
						var userIdAllProps = undefined;
						var userIdAllSheet = undefined;
						var c1Recalc = null, r1Recalc = null;
						var selectRangeRecalc = asc_Range(c.col, r.row, c.col, r.row);
						// Пересчет для входящих ячеек в добавленные строки/столбцы
						var isIntersection = this._recalcRangeByInsertRowsAndColumns(sheetId, selectRangeRecalc);
						if (false === isIntersection) {
							lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/null,
								sheetId, new asc_CCollaborativeRange(selectRangeRecalc.c1, selectRangeRecalc.r1,
									selectRangeRecalc.c2, selectRangeRecalc.r2));
							isLocked = this.collaborativeEditing.getLockIntersection(lockInfo,
								c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false);
							if (false !== isLocked) {
								// Кто-то сделал lock
								userId = isLocked.UserId;
								lockRange = isLocked.Element["rangeOrObjectId"];

								c1Recalc = this.collaborativeEditing.m_oRecalcIndexColumns[sheetId].getLockOther(
									lockRange["c1"], c_oAscLockTypes.kLockTypeOther);
								r1Recalc = this.collaborativeEditing.m_oRecalcIndexRows[sheetId].getLockOther(
									lockRange["r1"], c_oAscLockTypes.kLockTypeOther);
								if (null !== c1Recalc && null !== r1Recalc) {
									lockRangePosLeft = this.getCellLeft(c1Recalc, /*pt*/1);
									lockRangePosTop = this.getCellTop(r1Recalc, /*pt*/1);
									// Пересчитываем X и Y относительно видимой области
									lockRangePosLeft -= (this.cols[this.visibleRange.c1].left - this.cellsLeft);
									lockRangePosTop -= (this.rows[this.visibleRange.r1].top - this.cellsTop);
									// Пересчитываем в px
									lockRangePosLeft *= asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIX());
									lockRangePosTop *= asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIY());
								}
							}
						} else {
							lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/null,
								sheetId, null);
						}
						// Проверим не удален ли весь лист (именно удален, т.к. если просто залочен, то не рисуем рамку вокруг)
						lockInfo["type"] = c_oAscLockTypeElem.Sheet;
						isLocked = this.collaborativeEditing.getLockIntersection(lockInfo,
							c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/true);
						if (false !== isLocked) {
							// Кто-то сделал lock
							userIdAllSheet = isLocked.UserId;
							lockAllPosLeft = this.cellsLeft * asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIX());
							lockAllPosTop = this.cellsTop * asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIY());
						}

						// Проверим не залочены ли все свойства листа (только если не удален весь лист)
						if (undefined === userIdAllSheet) {
							lockInfo["type"] = c_oAscLockTypeElem.Range;
							lockInfo["subType"] = c_oAscLockTypeElemSubType.InsertRows;
							isLocked = this.collaborativeEditing.getLockIntersection(lockInfo,
								c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/true);
							if (false !== isLocked) {
								// Кто-то сделал lock
								userIdAllProps = isLocked.UserId;

								lockAllPosLeft = this.cellsLeft * asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIX());
								lockAllPosTop = this.cellsTop * asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIY());
							}
						}
						
						// Проверим есть ли комменты
						var mergedRande = this._getMergedCellsRange(c.col, r.row);
						
						var comments = this.cellCommentator.asc_getComments(mergedRande ? mergedRande.c1 : c.col, mergedRande ? mergedRande.r1 : r.row);
						var coords = this.cellCommentator.getCommentsCoords(comments);
						var indexes = [];
						for (var i = 0; i < comments.length; i++) {
							indexes.push(comments[i].asc_getId());
						}

						if (indexes.length <= 0) {
							coords = undefined;
							indexes = undefined;
						}

						// Проверим, может мы в гиперлинке
						var indexHyperlink = this._getHyperlinkIndex(c.col, r.row);
						var cellCursor = {cursor: kCurCells, target: "cells", col: (c ? c.col : -1),
							row: (r ? r.row : -1), userId: userId,
							lockRangePosLeft: lockRangePosLeft, lockRangePosTop: lockRangePosTop,
							userIdAllProps: userIdAllProps, lockAllPosLeft: lockAllPosLeft,
							lockAllPosTop: lockAllPosTop, userIdAllSheet: userIdAllSheet,
							commentIndexes: indexes, commentCoords: coords};
						if (null != indexHyperlink) {
							return {cursor: kCurHyperlink, target: "hyperlink",
								hyperlink: this.visibleHyperlinks[indexHyperlink], cellCursor: cellCursor,
								userId: userId, lockRangePosLeft: lockRangePosLeft,
								lockRangePosTop: lockRangePosTop, userIdAllProps: userIdAllProps,
								userIdAllSheet: userIdAllSheet, lockAllPosLeft: lockAllPosLeft,
								lockAllPosTop: lockAllPosTop, commentIndexes: indexes, commentCoords: coords};
						}
						return cellCursor;
					}

					if (x <= this.cellsLeft && y >= this.cellsTop) {
						r = this._findRowUnderCursor(y, true);
						if (r === null) {break;}
						f = r.row !== this.visibleRange.r1 && y < r.top + 3 || y >= r.bottom - 3;
						// ToDo В Excel зависимость epsilon от размера ячейки (у нас фиксированный 3)
						return {
							cursor: f ? kCurRowResize : kCurRowSelect,
							target: f ? "rowresize" : "rowheader",
							col: -1,
							row: r.row + (r.row !== this.visibleRange.r1 && f && y < r.top + 3 ? -1 : 0),
							mouseY: f ? ((y < r.top + 3) ? (r.top - y - this.height_1px): (r.bottom - y - this.height_1px))  : null
						};
					}

					if (y <= this.cellsTop && x >= this.cellsLeft) {
						c = this._findColUnderCursor(x, true);
						if (c === null) {break;}
						f = c.col !== this.visibleRange.c1 && x < c.left + 3 || x >= c.right - 3;
						// ToDo В Excel зависимость epsilon от размера ячейки (у нас фиксированный 3)
						return {
							cursor: f ? kCurColResize : kCurColSelect,
							target: f ? "colresize" : "colheader",
							col: c.col + (c.col !== this.visibleRange.c1 && f && x < c.left + 3 ? -1 : 0),
							row: -1,
							mouseX: f ? ((x < c.left + 3) ? (c.left - x - this.width_1px): (c.right - x - this.width_1px))  : null
						};
					}
				
				} while(0);

				return {cursor: kCurDefault, target: "none", col: -1, row: -1};
			},

			_fixSelectionOfMergedCells: function (fixedRange) {
				var t = this;

				function checkRange(range) {
					var c, r, res;
					for (r = range.r1; r <= range.r2 && r < t.nRowsCount; ++r) {
						for (c = range.c1; c <= range.c2 && c < t.nColsCount; ++c) {
							res = t._getMergedCellsRange(c, r);
							if (res === undefined) {continue;}
							res = range.union(res);
							if ( !range.isEqual(res) ) {return checkRange(res);}
						}
					}
					return range;
				}

				var ar = fixedRange ? fixedRange : ((this.isFormulaEditMode) ?
					t.arrActiveFormulaRanges[t.arrActiveFormulaRanges.length - 1] : t.activeRange);

				if( !ar ) { return; }

				if (ar.type && ar.type !== c_oAscSelectionType.RangeCells) { return; }

				var res = checkRange(ar.clone(true));

				if (ar.c1 !== res.c1 && ar.c1 !== res.c2) {
					ar.c1 = ar.c1 <= ar.c2 ? res.c1 : Math.min(res.c2, this.nColsCount - 1);
				}
				ar.c2 = ar.c1 === res.c1 ? Math.min(res.c2, this.nColsCount - 1) : (res.c1);

				if (ar.r1 !== res.r1 && ar.r1 !== res.r2) {
					ar.r1 = ar.r1 <= ar.r2 ? res.r1 : Math.min(res.r2, this.nRowsCount - 1);
				}
				ar.r2 = ar.r1 === res.r1 ? Math.min(res.r2, this.nRowsCount - 1) : res.r1;
			},

			/* isDraw - отрисовываем ли мы из draw (после сброса) */
			_fixSelectionOfHiddenCells: function (dc, dr, isDraw) {
				var t = this, ar = t.activeRange, c1, c2, r1, r2, mc, i, arn = t.activeRange.clone(true);

				if (dc === undefined) {dc = +1;}
				if (dr === undefined) {dr = +1;}


				function findVisibleCol(from, dc, flag) {
					var to = dc < 0 ? -1 : t.cols.length, c;
					for (c = from; c !== to; c += dc) {
						if (t.cols[c].width > t.width_1px) {return c;}
					}
					return flag ? -1 : findVisibleCol(from, dc * -1, true);
				}

				function findVisibleRow(from, dr, flag) {
					var to = dr < 0 ? -1 : t.rows.length, r;
					for (r = from; r !== to; r += dr) {
						if (t.rows[r].height > t.height_1px) {return r;}
					}
					return flag ? -1 : findVisibleRow(from, dr * -1, true);
				}

				if (ar.c2 === ar.c1) {
					if (t.cols[ar.c1].width < t.width_1px) {
						c1 = c2 = findVisibleCol(ar.c1, dc);
					}
				} else {
					if (t.cols[ar.c2].width < t.width_1px) {
						// Проверка для одновременно замерженных и скрытых ячеек (A1:C1 merge, B:C hidden)
						for (mc = null, i = arn.r1; i <= arn.r2; ++i) {
							mc = t._getMergedCellsRange(ar.c2, i);
							if (mc) {break;}
						}
						if (!mc) {c2 = findVisibleCol(ar.c2, dc);}
					}
				}
				if (c1 < 0 || c2 < 0) {throw "Error: all columns are hidden";}

				if (ar.r2 === ar.r1) {
					if (t.rows[ar.r1].height < t.height_1px) {
						r1 = r2 = findVisibleRow(ar.r1, dr);
					}
				} else {
					if (t.rows[ar.r2].height < t.height_1px) {
						//Проверка для одновременно замерженных и скрытых ячеек (A1:A3 merge, 2:3 hidden)
						for (mc = null, i = arn.c1; i <= arn.c2; ++i) {
							mc = t._getMergedCellsRange(i, ar.r2);
							if (mc) {break;}
						}
						if (!mc) {r2 = findVisibleRow(ar.r2, dr);}
					}
				}
				if (r1 < 0 || r2 < 0) {throw "Error: all rows are hidden";}

				ar.assign(
					c1 !== undefined ? c1 : ar.c1,
					r1 !== undefined ? r1 : ar.r1,
					c2 !== undefined ? c2 : ar.c2,
					r2 !== undefined ? r2 : ar.r2);

				if (c1 >= 0) {ar.startCol = c1;}
				if (r1 >= 0) {ar.startRow = r1;}

				if (t.cols[ar.startCol].width < t.width_1px) {
					c1 = findVisibleCol(ar.startCol, dc);
					if (c1 >= 0) {ar.startCol = c1;}
				}
				if (t.rows[ar.startRow].height < t.height_1px) {
					r1 = findVisibleRow(ar.startRow, dr);
					if (r1 >= 0) {ar.startRow = r1;}
				}
			},

			_moveActiveCellToXY: function (x, y) {
				var c, r;
				var xpos = x;
				var ypos = y;
				var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;

				x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
				y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );

				if (x < this.cellsLeft && y < this.cellsTop) {
					ar.assign(0, 0, this.cols.length - 1, this.rows.length - 1);
					ar.type = c_oAscSelectionType.RangeMax;
					ar.startCol = 0;
					ar.startRow = 0;
					this._fixSelectionOfHiddenCells();
				} else if (x < this.cellsLeft) {
					r = this._findRowUnderCursor(y).row;
					ar.assign(0, r, this.cols.length - 1, r);
					ar.type = c_oAscSelectionType.RangeRow;
					ar.startCol = 0;
					ar.startRow = r;
					this._fixSelectionOfHiddenCells();
				} else if (y < this.cellsTop) {
					c = this._findColUnderCursor(x).col;
					ar.assign(c, 0, c, this.rows.length - 1);
					ar.type = c_oAscSelectionType.RangeCol;
					ar.startCol = c;
					ar.startRow = 0;
					this._fixSelectionOfHiddenCells();
				} else {
					c = this._findColUnderCursor(x).col;
					r = this._findRowUnderCursor(y).row;
					ar.assign(c, r, c, r);
					ar.startCol = c;
					ar.startRow = r;

					var index = this.objectRender.inSelectionDrawingObjectIndex(xpos, ypos, true);
					if (index >= 0)
					{
						if (this.objectRender.isChartDrawingObject(index))
							ar.type = c_oAscSelectionType.RangeChart;
						else
							ar.type = c_oAscSelectionType.RangeImage;
					}
					else
					{
						ar.type = c_oAscSelectionType.RangeCells;
						this._fixSelectionOfMergedCells();
					}
				}
			},

			_moveActiveCellToOffset: function (dc, dr) {
				var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
				var mc = this._getMergedCellsRange(ar.startCol, ar.startRow);
				var c  = mc ? ( dc < 0 ? mc.c1 : dc > 0 ? Math.min(mc.c2, this.nColsCount - 1 - dc) : ar.startCol) : ar.startCol;
				var r  = mc ? ( dr < 0 ? mc.r1 : dr > 0 ? Math.min(mc.r2, this.nRowsCount - 1 - dr) : ar.startRow ) : ar.startRow;
				var p  = this._calcCellPosition(c, r, dc, dr);
				ar.assign(p.col, p.row, p.col, p.row);
				ar.type = c_oAscSelectionType.RangeCells;
				ar.startCol = p.col;
				ar.startRow = p.row;
				this._fixSelectionOfMergedCells();
				ar.normalize();
				this._fixSelectionOfHiddenCells(dc>=0?+1:-1, dr>=0?+1:-1);
			},

			// Движение активной ячейки в выделенной области
			_moveActivePointInSelection: function (dc, dr) {
				var ar = this.activeRange;
				var arn = this.activeRange.clone(true);

				// Set active cell
				ar.startCol += dc;
				ar.startRow += dr;

				do {
					var done = true;

					// Обработка выхода за границы выделения
					if (ar.startCol < arn.c1) {
						ar.startCol = arn.c2;
						ar.startRow -= 1;
						if (ar.startRow < arn.r1) { ar.startRow = arn.r2; }
					} else if (ar.startCol > arn.c2) {
						ar.startCol = arn.c1;
						ar.startRow += 1;
						if (ar.startRow > arn.r2) { ar.startRow = arn.r1; }
					}
					if (ar.startRow < arn.r1){
						ar.startRow = arn.r2;
						ar.startCol -= 1;
						if (ar.startCol < arn.c1) { ar.startCol = arn.c2; }
					} else if (ar.startRow > arn.r2){
						ar.startRow = arn.r1;
						ar.startCol += 1;
						if (ar.startCol > arn.c2) { ar.startCol = arn.c1; }
					}

					// Обработка движения active point через merged cells
					var mergedCells = this._getMergedCellsRange(ar.startCol, ar.startRow);

					if (mergedCells) {
						if (dc > 0 && (ar.startCol > mergedCells.c1 || ar.startRow !== mergedCells.r1)) {
							// Движение слева направо
							ar.startCol = mergedCells.c2 + 1;
							done = false;
						} else if (dc < 0 && (ar.startCol < mergedCells.c2 || ar.startRow !== mergedCells.r1)) {
							// Движение справа налево
							ar.startCol = mergedCells.c1 - 1;
							done = false;
						}
						if (dr > 0 && (ar.startRow > mergedCells.r1 || ar.startCol !== mergedCells.c1)) {
							// Движение сверху вниз
							ar.startRow = mergedCells.r2 + 1;
							done = false;
						} else if (dr < 0 && (ar.startRow < mergedCells.r2 || ar.startCol !== mergedCells.c1)) {
							// Движение снизу вверх
							ar.startRow = mergedCells.r1 - 1;
							done = false;
						}
					}
					if (!done) { continue; }

					// Обработка движения через срытые столбцы/строки
					while (ar.startCol >= arn.c1 && ar.startCol <= arn.c2 && this.cols[ar.startCol].width < 0.000001) {
						ar.startCol += dc || (dr > 0 ? +1 : -1);
						done = false;
					}
					if (!done) { continue; }

					while (ar.startRow >= arn.r1 && ar.startRow <= arn.r2 && this.rows[ar.startRow].height < 0.000001) {
						ar.startRow += dr || (dc > 0 ? +1 : -1);
						done = false;
					}
				} while (!done);
			},

			_calcSelectionEndPointByXY: function (x, y) {
				var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
				x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
				y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );
				return {
					c2: ar.type === c_oAscSelectionType.RangeCol || ar.type === c_oAscSelectionType.RangeCells ? this._findColUnderCursor(x).col : ar.c2,
					r2: ar.type === c_oAscSelectionType.RangeRow || ar.type === c_oAscSelectionType.RangeCells ? this._findRowUnderCursor(y).row : ar.r2
				};
			},

			_calcSelectionEndPointByOffset: function (dc, dr) {
				var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
				var mc = this._getMergedCellsRange(ar.c2, ar.r2);
				var c  = mc ? ( dc <= 0 ? mc.c1 : mc.c2 ) : ar.c2;
				var r  = mc ? ( dr <= 0 ? mc.r1 : mc.r2 ) : ar.r2;
				var p  = this._calcCellPosition(c, r, dc, dr);
				return {c2: p.col, r2: p.row};
			},

			_calcActiveRangeOffset: function () {
				var vr = this.visibleRange;
				var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
				if (this.isFormulaEditMode) {
					// Для формул нужно сделать ограничение по range (у нас хранится полный диапазон)
					if (ar.c2 >= this.nColsCount || ar.r2 >= this.nRowsCount) {
						ar = ar.clone(true);
						ar.c2 = (ar.c2 >= this.nColsCount) ? this.nColsCount - 1 : ar.c2;
						ar.r2 = (ar.r2 >= this.nRowsCount) ? this.nRowsCount - 1 : ar.r2;
					}
				}
				var arn = ar.clone(true);
				var isMC = this._isMergedCells(arn);
				// var adjustRight = ar.c2 >= vr.c2 || ar.c1 >= vr.c2 && isMC;
				var adjustRight = ar.startCol >= vr.c2;
				// var adjustBottom = ar.r2 >= vr.r2 || ar.r1 >= vr.r2 && isMC;
				var adjustBottom = ar.startRow >= vr.r2;
				// var incX = ar.c1 < vr.c1 && isMC ? arn.c1 - vr.c1 : ar.c2 < vr.c1 ? ar.c2 - vr.c1 : 0;
				var incX = ar.startCol < vr.c1 && isMC ? arn.c1 - vr.c1 : ar.startCol < vr.c1 ? ar.startCol - vr.c1 : 0;
				// var incY = ar.r1 < vr.r1 && isMC ? arn.r1 - vr.r1 : ar.r2 < vr.r1 ? ar.r2 - vr.r1 : 0;
				var incY = ar.startRow < vr.r1 && isMC ? arn.r1 - vr.r1 : ar.startRow < vr.r1 ? ar.startRow - vr.r1 : 0;

				if (adjustRight) {
					while ( this._isColDrawnPartially(isMC ? arn.c2 : ar.c2, vr.c1 + incX) ) {++incX;}
				}
				if (adjustBottom) {
					while ( this._isRowDrawnPartially(isMC ? arn.r2 : ar.r2, vr.r1 + incY) ) {++incY;}
				}
				return {
					deltaX: ar.type === c_oAscSelectionType.RangeCol || ar.type === c_oAscSelectionType.RangeCells ? incX : 0,
					deltaY: ar.type === c_oAscSelectionType.RangeRow || ar.type === c_oAscSelectionType.RangeCells ? incY : 0
				};
			},

			_calcActiveCellOffset: function () {
				var vr = this.visibleRange;
				var ar = this.activeRange;
				var arn = ar.clone(true);
				var isMC = this._isMergedCells(arn);
				var adjustRight = ar.startCol >= vr.c2 || ar.startCol >= vr.c2 && isMC;
				var adjustBottom = ar.startRow >= vr.r2 || ar.startRow >= vr.r2 && isMC;
				var incX = ar.startCol < vr.c1 && isMC ? arn.startCol - vr.c1 : ar.startCol < vr.c1 ? ar.startCol - vr.c1 : 0;
				var incY = ar.startRow < vr.r1 && isMC ? arn.startRow - vr.r1 : ar.startRow < vr.r1 ? ar.startRow - vr.r1 : 0;

				if (adjustRight) {
					while ( this._isColDrawnPartially(isMC ? arn.startCol : ar.startCol, vr.c1 + incX) ) {++incX;}
				}
				if (adjustBottom) {
					while ( this._isRowDrawnPartially(isMC ? arn.startRow : ar.startRow, vr.r1 + incY) ) {++incY;}
				}
				return {
					deltaX: ar.type === c_oAscSelectionType.RangeCol || ar.type === c_oAscSelectionType.RangeCells ? incX : 0,
					deltaY: ar.type === c_oAscSelectionType.RangeRow || ar.type === c_oAscSelectionType.RangeCells ? incY : 0
				};
			},

			_calcFillHandleOffset: function (range) {
				var vr = this.visibleRange;
				var ar = range ? range : this.activeFillHandle;
				var arn = ar.clone(true);
				var isMC = this._isMergedCells(arn);
				var adjustRight = ar.c2 >= vr.c2 || ar.c1 >= vr.c2 && isMC;
				var adjustBottom = ar.r2 >= vr.r2 || ar.r1 >= vr.r2 && isMC;
				var incX = ar.c1 < vr.c1 && isMC ? arn.c1 - vr.c1 : ar.c2 < vr.c1 ? ar.c2 - vr.c1 : 0;
				var incY = ar.r1 < vr.r1 && isMC ? arn.r1 - vr.r1 : ar.r2 < vr.r1 ? ar.r2 - vr.r1 : 0;

				if (adjustRight) {
					try{
						while ( this._isColDrawnPartially(isMC ? arn.c2 : ar.c2, vr.c1 + incX) ) {++incX;}
					}
					catch(e){
						this.expandColsOnScroll(true);
						this._trigger("reinitializeScrollX");
					}
				}
				if (adjustBottom) {
					try{
						while ( this._isRowDrawnPartially(isMC ? arn.r2 : ar.r2, vr.r1 + incY) ) {++incY;}
					}
					catch(e){
						this.expandRowsOnScroll(true);
						this._trigger("reinitializeScrollY");
					}
				}
				return {
					deltaX: incX,
					deltaY: incY
				};
			},

			// Потеряем ли мы что-то при merge ячеек
			getSelectionMergeInfo: function (options) {
				var t = this;
				var arn = t.activeRange.clone(true);
				var range;
				var notEmpty = false;
				var r, c;
				if (c_oAscSelectionType.RangeMax === t.activeRange.type) {
					range = t.model.getRange3(/*arn.r1*/0, /*arn.c1*/0, gc_nMaxRow0, gc_nMaxCol0);
				}
				else if (c_oAscSelectionType.RangeCol === t.activeRange.type) {
					range = t.model.getRange3(/*arn.r1*/0, arn.c1, gc_nMaxRow0, arn.c2);
				}
				else if (c_oAscSelectionType.RangeRow === t.activeRange.type) {
					range = t.model.getRange3(arn.r1, /*arn.c1*/0, arn.r2, gc_nMaxCol0);
				}
				else {
					range = t.model.getRange3(arn.r1, arn.c1, arn.r2, arn.c2);
				}

				switch (options) {
					case c_oAscMergeOptions.Merge:
					case c_oAscMergeOptions.MergeCenter:
						for (r = arn.r1; r <= arn.r2; ++r) {
							for (c = arn.c1; c <= arn.c2; ++c) {
								if (false === this._isCellEmpty(c, r)) {
									if (notEmpty)
										return true;
									notEmpty = true;
								}
							}
						}
						break;
					case c_oAscMergeOptions.MergeAcross:
						for (r = arn.r1; r <= arn.r2; ++r)
						{
							notEmpty = false;
							for (c = arn.c1; c <= arn.c2; ++c) {
								if (false === this._isCellEmpty(c, r)) {
									if (notEmpty)
										return true;
									notEmpty = true;
								}
							}
						}
						break;
				}

				return false;
			},

			getSelectionName: function (bRangeText) {
				var activeCell = this.activeRange;
				var mc = this._getMergedCellsRange(activeCell.startCol, activeCell.startRow);
				var c1 = mc ? mc.c1 : activeCell.startCol;
				var r1 = mc ? mc.r1 : activeCell.startRow;

				var selectionSize = !bRangeText ? "" : (function (r) {
					var rc = Math.abs(r.r2 - r.r1) + 1;
					var cc = Math.abs(r.c2 - r.c1) + 1;
					switch (r.type) {
						case c_oAscSelectionType.RangeCells: return rc + "R x " + cc + "C";
						case c_oAscSelectionType.RangeCol: return cc + "C";
						case c_oAscSelectionType.RangeRow: return rc + "R";
						case c_oAscSelectionType.RangeMax: return gc_nMaxRow + "R x " + gc_nMaxCol + "C";
					}
					return "";
				})(activeCell);

				var cellName =  this._getColumnTitle(c1) + this._getRowTitle(r1);
				return selectionSize || cellName;
			},

			getSelectionRangeValue: function () {
				var sListName = this.model.getName();
				return sListName + "!" + this.getActiveRange(this.activeRange.clone(true));
			},

			getSelectionInfo: function (bExt) {
				var c_opt = this.settings.cells;
				var activeCell = this.activeRange;
				var mc = this._getMergedCellsRange(activeCell.startCol, activeCell.startRow);
				var c1 = mc ? mc.c1 : activeCell.startCol;
				var r1 = mc ? mc.r1 : activeCell.startRow;
				var c = this._getVisibleCell(c1, r1);

				if (c === undefined) {
					asc_debug("log", "Unknown cell's info: col = " + c1 + ", row = " + r1);
					return {};
				}

				var fc = c.getFontcolor();
				var bg = c.getFill();
				var b = this._getBordersCache(c1, r1);
				var fa = c.getFontAlign().toLowerCase();
				var cellType = c.getType();
				var isNumberFormat = (!cellType || CellValueType.Number === cellType);

				var cell_info = new asc_CCellInfo();
				cell_info.name =  this._getColumnTitle(c1) + this._getRowTitle(r1);
				cell_info.formula = c.getFormula();
				cell_info.text = c.getValueForEdit();
				cell_info.halign = c.getAlignHorizontalByValue().toLowerCase();
				cell_info.valign = c.getAlignVertical().toLowerCase();
				cell_info.isFormatTable = this.autoFilters.searchRangeInTableParts(activeCell, this);

				cell_info.flags = new asc_CCellFlag();
				cell_info.flags.merge = !!this._getMergedCellsRange(c1, r1);
				cell_info.flags.shrinkToFit = c.getShrinkToFit();
				cell_info.flags.wrapText = c.getWrap();
				cell_info.flags.selectionType = this.activeRange.type;
				cell_info.flags.lockText = ("" !== cell_info.text && (isNumberFormat || "" !== cell_info.formula));

				cell_info.font = new asc_CFont();
				cell_info.font.name = c.getFontname();
				cell_info.font.size = c.getFontsize();
				cell_info.font.bold = c.getBold();
				cell_info.font.italic = c.getItalic();
				cell_info.font.underline = ("none" !== c.getUnderline()); // ToDo убрать, когда будет реализовано двойное подчеркивание
				cell_info.font.strikeout = c.getStrikeout();
				cell_info.font.subscript = fa === "subscript";
				cell_info.font.superscript = fa === "superscript";
				cell_info.font.color = (fc ? asc_obj2Color(fc) : asc_n2Color(c_opt.defaultState.colorNumber));

				cell_info.fill = new asc_CFill((null !==  bg && undefined !== bg) ? asc_obj2Color(bg) : bg);

				cell_info.border = new asc_CBorders();
				cell_info.border.left = new asc_CBorder(b.l.w, b.l.s, b.l.c);
				cell_info.border.top = new asc_CBorder(b.t.w, b.t.s, b.t.c);
				cell_info.border.right = new asc_CBorder(b.r.w, b.r.s, b.r.c);
				cell_info.border.bottom = new asc_CBorder(b.b.w, b.b.s, b.b.c);
				cell_info.border.diagDown = new asc_CBorder(b.dd.w, b.dd.s, b.dd.c);
				cell_info.border.diagUp = new asc_CBorder(b.du.w, b.du.s, b.du.c);

				// Получаем гиперссылку
				var ar = this.activeRange.clone();
				var range = this.model.getRange3(ar.r1, ar.c1, ar.r2, ar.c2);
				var hyperlink = range.getHyperlink ();
				if (null != hyperlink) {
					// Гиперлинк
					var oHyperlink = new asc_CHyperlink();
					// Range для гиперссылки
					var hyperlinkRange = hyperlink.Ref.getBBox0();
					oHyperlink.asc_setHyperlinkRange (hyperlinkRange);
					// Тип гиперссылки
					var type = (null !== hyperlink.Hyperlink) ? c_oAscHyperlinkType.WebLink : c_oAscHyperlinkType.RangeLink;
					oHyperlink.asc_setType (type);
					if (c_oAscHyperlinkType.RangeLink === type) {
						// // ToDo переделать это место (парсить должны в момент открытия и добавления ссылки)
						var result = parserHelp.parse3DRef (hyperlink.Location);
						if (null !== result) {
							oHyperlink.asc_setSheet (result.sheet);
							oHyperlink.asc_setRange (result.range);
						}
					}
					oHyperlink.asc_setLocation (hyperlink.Location);
					oHyperlink.asc_setTooltip (hyperlink.Tooltip);
					oHyperlink.asc_setHyperlinkUrl (hyperlink.Hyperlink);

					cell_info.hyperlink = oHyperlink;
					cell_info.hyperlink.asc_setText (cell_info.text);
				}
				else
					cell_info.hyperlink = null;

				if(bExt)
				{
					cell_info.innertext = c.getValue();
					cell_info.numFormat = c.getNumFormatStr();
				}

				if (false !== this.collaborativeEditing.isCoAuthoringExcellEnable()) {
					// Разрешено совместное редактирование
					var sheetId = this.model.getId();
					// Пересчет для входящих ячеек в добавленные строки/столбцы
					var isIntersection = this._recalcRangeByInsertRowsAndColumns(sheetId, ar);
					if (false === isIntersection) {
						var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/null, sheetId, new asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));

						if (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
							c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false)) {
							// Уже ячейку кто-то редактирует
							cell_info.isLocked = true;
						}
					}
				}

				return cell_info;
			},

			// Получаем координаты активной ячейки
			getActiveCellCoord: function () {
				var xL = this.getCellLeft(this.activeRange.startCol, /*pt*/1);
				var yL = this.getCellTop(this.activeRange.startRow, /*pt*/1);
				// Пересчитываем X и Y относительно видимой области
				xL -= (this.cols[this.visibleRange.c1].left - this.cellsLeft);
				yL -= (this.rows[this.visibleRange.r1].top - this.cellsTop);
				// Пересчитываем в px
				xL *= asc_getcvt( 1/*pt*/, 0/*px*/, this._getPPIX() );
				yL *= asc_getcvt( 1/*pt*/, 0/*px*/, this._getPPIY() );
				var width = this.getColumnWidth (this.activeRange.startCol, /*px*/0);
				var height = this.getRowHeight(this.activeRange.startRow, /*px*/0);
				return new asc_CCellRect (xL, yL, width, height);
			},

			setSelection: function (range, validRange) {
				// Проверка на валидность range.
				if (validRange && (range.c2 >= this.nColsCount || range.r2 >= this.nRowsCount)) {
					if (range.c2 >= this.nColsCount)
						this.expandColsOnScroll(false, true, range.c2 + 1);
					if (range.r2 >= this.nRowsCount)
						this.expandRowsOnScroll(false, true, range.r2 + 1);
				}

				this.cleanSelection();
				// Проверка на всякий случай
				if (!(range instanceof asc_Range)) {
					range = asc_Range (range.c1, range.r1, range.c2, range.r2);
				}
				if(gc_nMaxCol0 === range.c2 || gc_nMaxRow0 === range.r2)
				{
					range = range.clone();
					if(gc_nMaxCol0 === range.c2)
						range.c2 = this.cols.length - 1;
					if(gc_nMaxRow0 === range.r2)
						range.r2 = this.rows.length - 1;
				}

				this.activeRange = range;
				this.activeRange.type = c_oAscSelectionType.RangeCells;
				this.activeRange.startCol = range.c1;
				this.activeRange.startRow = range.r1;

				// Нормализуем range
				this.activeRange.normalize();
				this._drawSelection();

				this._trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/false));
				this._trigger("selectionChanged", this.getSelectionInfo());

				return this._calcActiveRangeOffset();
			},

			changeSelectionStartPoint: function (x, y, isCoord, isSelectMode) {
				var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1]: this.activeRange;
				var sc = ar.startCol, sr = ar.startRow, ret = {};

				this.cleanSelection();
				
				var commentList = this.cellCommentator.getCommentsXY(x, y);
				if ( !commentList.length ) {
					this.model.workbook.handlers.trigger("asc_onHideComment");
					this.cellCommentator.resetLastSelectedId();
				}

				var index = -1;
				if (isCoord) {
					// check drawing-objects coordinates
					index = this.objectRender.inSelectionDrawingObjectIndex(x, y, true);
					this.objectRender.unselectDrawingObjects();
					this.objectRender.selectDrawingObject(index);
					if ( index >= 0 ) {
						this.objectRender.setStartPointDrawingObject(index, x, y);
						this.objectRender.saveUndoRedoDrawingObject();
						//return ret;
					}
					
					var drawingInfo = this.objectRender.checkCursorDrawingObject(x, y);
					if ( drawingInfo ) {
						if ( drawingInfo.isShape )
								asc["editor"].isStartAddShape = true;
							else
								asc["editor"].isStartAddShape = false;
					}
					
					// move active range to coordinates x,y
					this._moveActiveCellToXY(x, y);
					
				} else {
					// move active range to offset x,y
					this._moveActiveCellToOffset(x, y);
					ret = this._calcActiveRangeOffset();
				}

				if (!this.isCellEditMode && (sc !== ar.startCol || sr !== ar.startRow)) {
					if (!this.isSelectDialogRangeMode) {
						this._trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/false));
						if (!isSelectMode)
							this._trigger("selectionChanged", this.getSelectionInfo());
					} else {
						// Смена диапазона
						this._trigger("selectionRangeChanged", this.getSelectionRangeValue());
					}
				}

				if ( index < 0 )
					this.drawDepCells();
				else
					this._trigger("setFocusDrawingObject", true);
					
				this.cellCommentator.drawCommentCells(false);
				
				return ret;
			},

			// Смена селекта по нажатию правой кнопки мыши
			changeSelectionStartPointRightClick: function (x, y) {

				// Выделяем объект
				var index = this.objectRender.inSelectionDrawingObjectIndex(x, y);
				if ( index >= 0 ) {
					this.objectRender.unselectDrawingObjects();
					this.objectRender.selectDrawingObject(index);
				}

				var ar = this.activeRange;

				// Получаем координаты левого верхнего угла выделения
				var xL = this.getCellLeft(ar.c1, /*pt*/1);
				var yL = this.getCellTop(ar.r1, /*pt*/1);
				// Получаем координаты правого нижнего угла выделения
				var xR = this.getCellLeft(ar.c2, /*pt*/1) + this.cols[ar.c2].width;
				var yR = this.getCellTop(ar.r2, /*pt*/1) + this.rows[ar.r2].height;

				// Пересчитываем координаты
				var _x = x * asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
				var _y = y * asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );

				var isInSelection = false;

				// Проверяем попали ли мы в выделение
				if (_x < this.cellsLeft && _y < this.cellsTop && c_oAscSelectionType.RangeMax === ar.type) {
					// Выделено все
					isInSelection = true;
				} else if (_x > this.cellsLeft && _y > this.cellsTop) {
					// Пересчитываем X и Y относительно видимой области
					_x += (this.cols[this.visibleRange.c1].left - this.cellsLeft);
					_y += (this.rows[this.visibleRange.r1].top - this.cellsTop);

					if (xL <= _x && _x <= xR && yL <= _y && _y <= yR) {
						// Попали в выделение ячеек
						isInSelection = true;
					}
				} else if (x <= this.cellsLeft && y >= this.cellsTop && c_oAscSelectionType.RangeRow === ar.type) {
					// Выделены строки
					// Пересчитываем Y относительно видимой области
					_y += (this.rows[this.visibleRange.r1].top - this.cellsTop);

					if (yL <= _y && _y <= yR) {
						// Попали в выделение ячеек
						isInSelection = true;
					}
				} else if (y <= this.cellsTop && x >= this.cellsLeft && c_oAscSelectionType.RangeCol === ar.type) {
					// Выделены столбцы
					// Пересчитываем X относительно видимой области
					_x += (this.cols[this.visibleRange.c1].left - this.cellsLeft);
					if (xL <= _x && _x <= xR) {
						// Попали в выделение ячеек
						isInSelection = true;
					}
				}

				if (!isInSelection) {
					// Не попали в выделение (меняем первую точку)
					this.cleanSelection();
					this._moveActiveCellToXY(x, y);
					// Нет селекта при клике по drawing-объекту
					if ( (ar.type !== c_oAscSelectionType.RangeImage) && (ar.type !== c_oAscSelectionType.RangeChart) ) {
						this.objectRender.unselectDrawingObjects();
						this._drawSelection();
					}

					this._trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/false));
					this._trigger("selectionChanged", this.getSelectionInfo());
					return false;
				}
				return true;
			},

			changeSelectionEndPoint: function (x, y, isCoord, isSelectMode) {
				if (isCoord) {
					// check drawing-objects coordinates
					var index = this.objectRender.getSelectedDrawingObjectIndex();
					if ( index >= 0 ) {
						this.objectRender.moveDrawingObject(index, x, y);

						var col = this._findColUnderCursor( x * asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() ), true );
						var row = this._findRowUnderCursor( y * asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() ), true );
						if ( col && row )
							this.objectRender.showOverlayDrawingObjects();

						this._drawCollaborativeElements(/*bIsDrawObjects*/false);
						return this._calcActiveRangeOffset();
					}
				}

				var ar = (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1] : this.activeRange;
				var arOld = ar.clone();
				var arnOld = ar.clone(true);
				var ep = isCoord ? this._calcSelectionEndPointByXY(x, y) : this._calcSelectionEndPointByOffset(x, y);
				var epOld, ret;

				if (ar.c2 !== ep.c2 || ar.r2 !== ep.r2) {
					this.cleanSelection();
					ar.assign(ar.startCol, ar.startRow, ep.c2, ep.r2);
					if (ar.type === c_oAscSelectionType.RangeCells) {
						this._fixSelectionOfMergedCells();
						while (!isCoord && arnOld.isEqual( ar.clone(true) )) {
							ar.c2 = ep.c2;
							ar.r2 = ep.r2;
							epOld = $.extend({}, ep);
							ep = this._calcSelectionEndPointByOffset(x<0?-1:x>0?+1:0, y<0?-1:y>0?+1:0);
							ar.assign(ar.startCol, ar.startRow, ep.c2, ep.r2);
							this._fixSelectionOfMergedCells();
							if (ep.c2 === epOld.c2 && ep.r2 === epOld.r2) {break;}
						}
					}
					if (!isCoord)
						this._fixSelectionOfHiddenCells(ar.c2 - arOld.c2 >= 0 ? +1 : -1, ar.r2 - arOld.r2 >= 0 ? +1 : -1);
					this._drawSelection();
					this.drawDepCells();
				}

				ret = this._calcActiveRangeOffset();

				if (!this.isCellEditMode && !arnOld.isEqual(ar.clone(true))) {
					if (!this.isSelectDialogRangeMode) {
						this._trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/true));
						if (!isSelectMode)
							this._trigger("selectionChanged", this.getSelectionInfo(false));
					} else {
						// Смена диапазона
						this._trigger("selectionRangeChanged", this.getSelectionRangeValue());
					}
				}

				return ret;
			},

			// Окончание выделения
			changeSelectionDone: function () {
				if (this.isFormulaEditMode) {
					// Нормализуем range
					this.arrActiveFormulaRanges[this.arrActiveFormulaRanges.length - 1].normalize();
				} else {
					// Нормализуем range
					this.activeRange.normalize();
				}
			},

			// Обработка движения в выделенной области
			changeSelectionActivePoint: function (dc, dr) {
				var ret;
				var ar = this.activeRange;
				var arMerge = this._getMergedCellsRange (ar.c1, ar.r1);

				// Если в выделенной области только одна ячейка, то просто сдвигаемся
				if (ar.c1 === ar.c2 && ar.r1 === ar.r2 ||
				    arMerge && ar.c1 === arMerge.c1 && ar.r1 === arMerge.r1 && ar.c2 === arMerge.c2 && ar.r2 === arMerge.r2)
					return this.changeSelectionStartPoint(dc, dr, /*isCoord*/false, /*isSelectMode*/false);

				// Очищаем выделение
				this.cleanSelection();
				// Двигаемся по выделенной области
				this._moveActivePointInSelection(dc, dr);
				// Перерисовываем
				this._drawSelection();

				// Смотрим, ушли ли мы за границу видимой области
				ret = this._calcActiveCellOffset();

				// Эвент обновления
				this._trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/false));
				this._trigger("selectionChanged", this.getSelectionInfo());

				return ret;
			},


			// ----- Changing cells -----

			/* Функция для работы автозаполнения (selection). (x, y) - координаты точки мыши на области */
			changeSelectionFillHandle: function (x, y) {
				// Возвращаемый результат
				var ret = null;
				// Если мы только первый раз попали сюда, то копируем выделенную область
				if (null === this.activeFillHandle) {
					this.activeFillHandle = this.activeRange.clone(true);
					// Для первого раза нормализуем (т.е. первая точка - это левый верхний угол)
					this.activeFillHandle.normalize();
					return ret;
				}

				// Пересчитываем координаты
				x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
				y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );

				// Очищаем выделение, будем рисовать заново
				this.cleanSelection();
				// Копируем выделенную область
				var ar = this.activeRange.clone(true);
				// Получаем координаты левого верхнего угла выделения
				var xL = this.getCellLeft(ar.c1, /*pt*/1);
				var yL = this.getCellTop(ar.r1, /*pt*/1);
				// Получаем координаты правого нижнего угла выделения
				var xR = this.getCellLeft(ar.c2, /*pt*/1) + this.cols[ar.c2].width;
				var yR = this.getCellTop(ar.r2, /*pt*/1) + this.rows[ar.r2].height;

				// range для пересчета видимой области
				var activeFillHandleCopy;

				// Колонка по X и строка по Y
				var colByX = this._findColUnderCursor (x, /*canReturnNull*/false, /*dX*/true).col;
				var rowByY = this._findRowUnderCursor (y, /*canReturnNull*/false, /*dX*/true).row;
				// Колонка по X и строка по Y (без половинчатого счета). Для сдвига видимой области
				var colByXNoDX = this._findColUnderCursor (x, /*canReturnNull*/false, /*dX*/false).col;
				var rowByYNoDY = this._findRowUnderCursor (y, /*canReturnNull*/false, /*dX*/false).row;
				// Сдвиг в столбцах и строках от крайней точки
				var dCol;
				var dRow;

				// Пересчитываем X и Y относительно видимой области
				x += (this.cols[this.visibleRange.c1].left - this.cellsLeft);
				y += (this.rows[this.visibleRange.r1].top - this.cellsTop);

				// Вычисляем расстояние от (x, y) до (xL, yL)
				var dXL = x - xL;
				var dYL = y - yL;
				// Вычисляем расстояние от (x, y) до (xR, yR)
				var dXR = x - xR;
				var dYR = y - yR;
				var dXRMod;
				var dYRMod;

				// Определяем область попадания и точку
				/*
						(1)					(2)					(3)

				 	------------|-----------------------|------------
								|						|
				 		(4)		|			(5)			|		(6)
								|						|
				 	------------|-----------------------|------------

				 		(7)					(8)					(9)
				*/

				// Область точки (x, y)
				var _tmpArea = 0;
				if (dXR <= 0){
					// Области (1), (2), (4), (5), (7), (8)
					if (dXL <= 0){
						// Области (1), (4), (7)
						if (dYR <= 0) {
							// Области (1), (4)
							if (dYL <= 0) {
								// Область (1)
								_tmpArea = 1;
							}
							else {
								// Область (4)
								_tmpArea = 4;
							}
						}
						else {
							// Область (7)
							_tmpArea = 7;
						}
					}
					else {
						// Области (2), (5), (8)
						if (dYR <= 0) {
							// Области (2), (5)
							if (dYL <= 0) {
								// Область (2)
								_tmpArea = 2;
							}
							else {
								// Область (5)
								_tmpArea = 5;
							}
						}
						else {
							// Область (3)
							_tmpArea = 8;
						}
					}
				}
				else {
					// Области (3), (6), (9)
					if (dYR <= 0){
						// Области (3), (6)
						if (dYL <= 0){
							// Область (3)
							_tmpArea = 3;
						}
						else {
							// Область (6)
							_tmpArea = 6;
						}
					}
					else {
						// Область (9)
						_tmpArea = 9;
					}
				}

				// Проверяем, в каком направлении движение
				switch (_tmpArea){
					case 2:
					case 8:
						// Двигаемся по вертикали.
						this.fillHandleDirection = 1;
						break;
					case 4:
					case 6:
						// Двигаемся по горизонтали.
						this.fillHandleDirection = 0;
						break;
					case 1:
						// Сравниваем расстояния от точки до левого верхнего угла выделения
						dXRMod = Math.abs(x - xL);
						dYRMod = Math.abs(y - yL);
						// Сдвиги по столбцам и строкам
						dCol = Math.abs(colByX - ar.c1);
						dRow = Math.abs(rowByY - ar.r1);
						// Определим направление позднее
						this.fillHandleDirection = -1;
						break;
					case 3:
						// Сравниваем расстояния от точки до правого верхнего угла выделения
						dXRMod = Math.abs(x - xR);
						dYRMod = Math.abs(y - yL);
						// Сдвиги по столбцам и строкам
						dCol = Math.abs(colByX - ar.c2);
						dRow = Math.abs(rowByY - ar.r1);
						// Определим направление позднее
						this.fillHandleDirection = -1;
						break;
					case 7:
						// Сравниваем расстояния от точки до левого нижнего угла выделения
						dXRMod = Math.abs(x - xL);
						dYRMod = Math.abs(y - yR);
						// Сдвиги по столбцам и строкам
						dCol = Math.abs(colByX - ar.c1);
						dRow = Math.abs(rowByY - ar.r2);
						// Определим направление позднее
						this.fillHandleDirection = -1;
						break;
					case 5:
					case 9:
						// Сравниваем расстояния от точки до правого нижнего угла выделения
						dXRMod = Math.abs(dXR);
						dYRMod = Math.abs(dYR);
						// Сдвиги по столбцам и строкам
						dCol = Math.abs(colByX - ar.c2);
						dRow = Math.abs(rowByY - ar.r2);
						// Определим направление позднее
						this.fillHandleDirection = -1;
						break;
				}

				//console.log(_tmpArea);

				// Возможно еще не определили направление
				if (-1 === this.fillHandleDirection) {
					// Проверим сдвиги по столбцам и строкам, если не поможет, то рассчитываем по расстоянию
					if (0 === dCol && 0 !== dRow) {
						// Двигаемся по вертикали.
						this.fillHandleDirection = 1;
					}
					else if (0 !== dCol && 0 === dRow) {
						// Двигаемся по горизонтали.
						this.fillHandleDirection = 0;
					}
					else if (dXRMod >= dYRMod){
						// Двигаемся по горизонтали.
						this.fillHandleDirection = 0;
					}
					else {
						// Двигаемся по вертикали.
						this.fillHandleDirection = 1;
					}
				}

				// Проверяем, в каком направлении движение
				if (0 === this.fillHandleDirection) {
					// Определяем область попадания и точку
					/*
								|						|
								|						|
						(1)		|			(2)			|		(3)
								|						|
								|						|
					*/
					if (dXR <= 0){
						// Область (1) или (2)
						if (dXL <= 0) {
							// Область (1)
							this.fillHandleArea = 1;
						}
						else {
							// Область (2)
							this.fillHandleArea = 2;
						}
					}
					else {
						// Область (3)
						this.fillHandleArea = 3;
					}

					// Находим колонку для точки
					this.activeFillHandle.c2 = colByX;

					switch(this.fillHandleArea) {
						case 1:
							// Первая точка (xR, yR), вторая точка (x, yL)
							this.activeFillHandle.c1 = ar.c2;
							this.activeFillHandle.r1 = ar.r2;

							this.activeFillHandle.r2 = ar.r1;

							// Когда идем назад, должна быть колонка на 1 больше
							this.activeFillHandle.c2 += 1;
							// Случай, если мы еще не вышли из внутренней области
							if (this.activeFillHandle.c2 == ar.c1)
								this.fillHandleArea = 2;
							break;
						case 2:
							// Первая точка (xR, yR), вторая точка (x, yL)
							this.activeFillHandle.c1 = ar.c2;
							this.activeFillHandle.r1 = ar.r2;

							this.activeFillHandle.r2 = ar.r1;

							// Когда идем назад, должна быть колонка на 1 больше
							this.activeFillHandle.c2 += 1;

							if (this.activeFillHandle.c2 > this.activeFillHandle.c1){
								// Ситуация половинки последнего столбца
								this.activeFillHandle.c1 = ar.c1;
								this.activeFillHandle.r1 = ar.r1;

								this.activeFillHandle.c2 = ar.c1;
								this.activeFillHandle.r2 = ar.r1;
							}
							break;
						case 3:
							// Первая точка (xL, yL), вторая точка (x, yR)
							this.activeFillHandle.c1 = ar.c1;
							this.activeFillHandle.r1 = ar.r1;

							this.activeFillHandle.r2 = ar.r2;
							break;
					}

					// Копируем в range для пересчета видимой области
					activeFillHandleCopy = this.activeFillHandle.clone();
					activeFillHandleCopy.c2 = colByXNoDX;
				}
				else {
					// Определяем область попадания и точку
					/*
										(1)
							____________________________


										(2)

					 		____________________________

					 					(3)
					*/
					if (dYR <= 0){
						// Область (1) или (2)
						if (dYL <= 0) {
							// Область (1)
							this.fillHandleArea = 1;
						}
						else {
							// Область (2)
							this.fillHandleArea = 2;
						}
					}
					else {
						// Область (3)
						this.fillHandleArea = 3;
					}

					// Находим строку для точки
					this.activeFillHandle.r2 = rowByY;

					switch(this.fillHandleArea) {
						case 1:
							// Первая точка (xR, yR), вторая точка (xL, y)
							this.activeFillHandle.c1 = ar.c2;
							this.activeFillHandle.r1 = ar.r2;

							this.activeFillHandle.c2 = ar.c1;

							// Когда идем назад, должна быть строка на 1 больше
							this.activeFillHandle.r2 += 1;
							// Случай, если мы еще не вышли из внутренней области
							if (this.activeFillHandle.r2 == ar.r1)
								this.fillHandleArea = 2;
							break;
						case 2:
							// Первая точка (xR, yR), вторая точка (xL, y)
							this.activeFillHandle.c1 = ar.c2;
							this.activeFillHandle.r1 = ar.r2;

							this.activeFillHandle.c2 = ar.c1;

							// Когда идем назад, должна быть строка на 1 больше
							this.activeFillHandle.r2 += 1;

							if (this.activeFillHandle.r2 > this.activeFillHandle.r1){
								// Ситуация половинки последней строки
								this.activeFillHandle.c1 = ar.c1;
								this.activeFillHandle.r1 = ar.r1;

								this.activeFillHandle.c2 = ar.c1;
								this.activeFillHandle.r2 = ar.r1;
							}
							break;
						case 3:
							// Первая точка (xL, yL), вторая точка (xR, y)
							this.activeFillHandle.c1 = ar.c1;
							this.activeFillHandle.r1 = ar.r1;

							this.activeFillHandle.c2 = ar.c2;
							break;
					}

					// Копируем в range для пересчета видимой области
					activeFillHandleCopy = this.activeFillHandle.clone();
					activeFillHandleCopy.r2 = rowByYNoDY;
				}

				//console.log ("row1: " + this.activeFillHandle.r1 + " col1: " + this.activeFillHandle.c1 + " row2: " + this.activeFillHandle.r2 + " col2: " + this.activeFillHandle.c2);
				// Перерисовываем
				this._drawSelection();

				// Смотрим, ушли ли мы за границу видимой области
				ret = this._calcFillHandleOffset(activeFillHandleCopy);
				return ret;
			},

			/* Функция для применения автозаполнения */
			applyFillHandle: function (x, y, ctrlPress) {
				var t = this;

				// Текущее выделение (к нему применится автозаполнение)
				var arn = t.activeRange.clone(true);
				arn.normalize();
				var range = t.model.getRange3(arn.r1, arn.c1, arn.r2, arn.c2);

				// Были ли изменения
				var bIsHaveChanges = false;
				// Вычисляем индекс сдвига
				var nIndex = 0; /*nIndex*/
				if (0 === this.fillHandleDirection){
					// Горизонтальное движение
					nIndex = this.activeFillHandle.c2 - arn.c1;
					if (2 === this.fillHandleArea) {
						// Для внутренности нужно вычесть 1 из значения
						bIsHaveChanges = arn.c2 !== (this.activeFillHandle.c2 - 1);
					}
					else
						bIsHaveChanges = arn.c2 !== this.activeFillHandle.c2;
				}
				else {
					// Вертикальное движение
					nIndex = this.activeFillHandle.r2 - arn.r1;
					if (2 === this.fillHandleArea) {
						// Для внутренности нужно вычесть 1 из значения
						bIsHaveChanges = arn.r2 !== (this.activeFillHandle.r2 - 1);
					}
					else
						bIsHaveChanges = arn.r2 !== this.activeFillHandle.r2;
				}

				// Меняли ли что-то
				if (bIsHaveChanges && (this.activeFillHandle.r1 !== this.activeFillHandle.r2 ||
					this.activeFillHandle.c1 !== this.activeFillHandle.c2)){

					// Диапазон ячеек, который мы будем менять
					var changedRange = this.activeRange.clone(true);

					// Очищаем выделение
					this.cleanSelection();
					if (2 === this.fillHandleArea) {
						// Мы внутри, будет удаление, нормируем и cбрасываем первую ячейку
						this.activeRange.normalize();
						this.activeRange.startCol = this.activeRange.c1;
						this.activeRange.startRow = this.activeRange.r1;
						// Проверяем, удалили ли мы все (если да, то область не меняется)
						if (arn.c1 !== this.activeFillHandle.c2 ||
							arn.r1 !== this.activeFillHandle.r2) {
							// Уменьшаем диапазон (мы удалили не все)
							if (0 === this.fillHandleDirection){
								// Горизонтальное движение (для внутренности необходимо вычесть 1)
								this.activeRange.c2 = this.activeFillHandle.c2 - 1;

								changedRange.c1 = changedRange.c2;
								changedRange.c2 = this.activeFillHandle.c2;
							}
							else {
								// Вертикальное движение (для внутренности необходимо вычесть 1)
								this.activeRange.r2 = this.activeFillHandle.r2 - 1;

								changedRange.r1 = changedRange.r2;
								changedRange.r2 = this.activeFillHandle.r2;
							}
						}
					}
					else {
						// Мы вне выделения. Увеличиваем диапазон
						if (0 === this.fillHandleDirection){
							// Горизонтальное движение
							if (1 === this.fillHandleArea){
								this.activeRange.c1 = this.activeFillHandle.c2;

								changedRange.c2 = changedRange.c1 - 1;
								changedRange.c1 = this.activeFillHandle.c2;
							}
							else {
								this.activeRange.c2 = this.activeFillHandle.c2;

								changedRange.c1 = changedRange.c2 + 1;
								changedRange.c2 = this.activeFillHandle.c2;
							}
						}
						else {
							// Вертикальное движение
							if (1 === this.fillHandleArea){
								this.activeRange.r1 = this.activeFillHandle.r2;

								changedRange.r2 = changedRange.r1 - 1;
								changedRange.r1 = this.activeFillHandle.r2;
							}
							else {
								this.activeRange.r2 = this.activeFillHandle.r2;

								changedRange.r1 = changedRange.r2 + 1;
								changedRange.r2 = this.activeFillHandle.r2;
							}
						}

						// После увеличения, нужно обновить больший range
						arn = this.activeRange.clone(true);
					}

					changedRange.normalize();

					var applyFillHandleCallback = function (res) {
						if (res) {
							// Автозаполняем ячейки
							t.model.onStartTriggerAction();
							range.promote(/*bCtrl*/ctrlPress, /*bVertical*/(1 === t.fillHandleDirection), nIndex);
							// Вызываем функцию пересчета для заголовков форматированной таблицы
							t.autoFilters._renameTableColumn(t, arn);
							t.model.onEndTriggerAction();
						}

						// Сбрасываем параметры автозаполнения
						t.activeFillHandle = null;
						t.fillHandleDirection = -1;

						// Обновляем все данные строки (т.к. могли быть ячейки, в которые не убрался текст, выровненные по левому и по правому краю, которые нужно перерисовать)
						arn.c1 = 0;
						arn.c2 = gc_nMaxCol0;
						// Обновляем выделенные ячейки
						t.isChanged = true;
						t._updateCellsRange(arn);
					};

					// Можно ли применять автозаполнение ?
					this._isLockedCells (changedRange, /*subType*/null, applyFillHandleCallback);
				}
				else {
					// Ничего не менялось, сбрасываем выделение
					this.cleanSelection();
					// Сбрасываем параметры автозаполнения
					this.activeFillHandle = null;
					this.fillHandleDirection = -1;
					// Перерисовываем
					this._drawSelection();
				}
			},

			/* Функция для работы перемещения диапазона (selection). (x, y) - координаты точки мыши на области
			*  ToDo нужно переделать, чтобы moveRange появлялся только после сдвига от текущей ячейки
			*/
			changeSelectionMoveRangeHandle: function (x, y, ctrlKey) {
				// Возвращаемый результат
				var ret = null;
				// Пересчитываем координаты
				x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
				y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );
				var ar = this.activeRange.clone(true);

				// Колонка по X и строка по Y
				var colByX = this._findColUnderCursor (x, /*canReturnNull*/false, /*dX*/false).col;
				var rowByY = this._findRowUnderCursor (y, /*canReturnNull*/false, /*dY*/false).row;
				
				// Если мы только первый раз попали сюда, то копируем выделенную область
				if (null === this.startCellMoveRange) {
					// Учитываем погрешность (мы должны быть внутри диапазона при старте)
					if (colByX < ar.c1) { colByX = ar.c1; }
					else if (colByX > ar.c2) { colByX = ar.c2; }
					if (rowByY < ar.r1) { rowByY = ar.r1; }
					else if (rowByY > ar.r2) { rowByY = ar.r2; }
					this.startCellMoveRange = asc_Range(colByX, rowByY, colByX, rowByY);
					this.startCellMoveRange.isChanged = false;	// Флаг, сдвигались ли мы от первоначального диапазона
					return ret;
				}

				// Разница, на сколько мы сдвинулись
				var colDelta = colByX - this.startCellMoveRange.c1;
				var rowDelta = rowByY - this.startCellMoveRange.r1;

				// Проверяем, нужно ли отрисовывать перемещение (сдвигались или нет)
				if (false === this.startCellMoveRange.isChanged && 0 === colDelta && 0 === rowDelta)
					return ret;
				// Выставляем флаг
				this.startCellMoveRange.isChanged = true;

				// Очищаем выделение, будем рисовать заново
				this.cleanSelection();

				this.activeMoveRange = ar;
				// Для первого раза нормализуем (т.е. первая точка - это левый верхний угол)
				this.activeMoveRange.normalize();

				// Выставляем
				this.activeMoveRange.c1 += colDelta;
				if (0 > this.activeMoveRange.c1) {
					colDelta -= this.activeMoveRange.c1;
					this.activeMoveRange.c1 = 0;
				}
				this.activeMoveRange.c2 += colDelta;

				this.activeMoveRange.r1 += rowDelta;
				if (0 > this.activeMoveRange.r1) {
					rowDelta -= this.activeMoveRange.r1;
					this.activeMoveRange.r1 = 0;
				}
				this.activeMoveRange.r2 += rowDelta;

				// Увеличиваем, если выходим за область видимости // Critical Bug 17413
				while (!this.cols[this.activeMoveRange.c2]) {
					this.expandColsOnScroll(true);
					this._trigger("reinitializeScrollX");
				}
				while (!this.rows[this.activeMoveRange.r2]) {
					this.expandRowsOnScroll(true);
					this._trigger("reinitializeScrollY");
				}

				// Перерисовываем
				this._drawSelection();
				var d = {
					deltaX : this.activeMoveRange.c1 < this.visibleRange.c1 ? this.activeMoveRange.c1-this.visibleRange.c1 :
						this.activeMoveRange.c2>this.visibleRange.c2 ? this.activeMoveRange.c2-this.visibleRange.c2 : 0,
					deltaY : this.activeMoveRange.r1 < this.visibleRange.r1 ? this.activeMoveRange.r1-this.visibleRange.r1 :
						this.activeMoveRange.r2>this.visibleRange.r2 ? this.activeMoveRange.r2-this.visibleRange.r2 : 0
				};
				while ( this._isColDrawnPartially( this.activeMoveRange.c2, this.visibleRange.c1 + d.deltaX) ) {++d.deltaX;}
				while ( this._isRowDrawnPartially( this.activeMoveRange.r2, this.visibleRange.r1 + d.deltaY) ) {++d.deltaY;}
				return d;
			},
			
			changeSelectionMoveResizeRangeHandle: function (x, y, targetInfo) {
				// Возвращаемый результат
				if( !targetInfo )
					return null;
				var indexFormulaRange = targetInfo.indexFormulaRange, d, ret;
				// Пересчитываем координаты
				x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
				y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );
				var ar = 0 == targetInfo.targetArr ? this.arrActiveFormulaRanges[indexFormulaRange].clone(true) : this.arrActiveChartsRanges[indexFormulaRange].clone(true);
				
				// Колонка по X и строка по Y
				var colByX = this._findColUnderCursor (x, /*canReturnNull*/false, /*dX*/false).col;
				var rowByY = this._findRowUnderCursor (y, /*canReturnNull*/false, /*dY*/false).row;
				
				// Если мы только первый раз попали сюда, то копируем выделенную область
				if (null === this.startCellMoveResizeRange) {
					if( (targetInfo.cursor == kCurNEResize || targetInfo.cursor == kCurSEResize) /* && 0 == targetInfo.targetArr */ ){
						this.startCellMoveResizeRange = ar.clone(true);
						// this.startCellMoveResizeRange2 = asc_Range(this.startCellMoveResizeRange.c1, this.startCellMoveResizeRange.r1, this.startCellMoveResizeRange.c1, this.startCellMoveResizeRange.r1,true);
						this.startCellMoveResizeRange2 = asc_Range(targetInfo.col, targetInfo.row, targetInfo.col, targetInfo.row,true);
					}
					else{
						this.startCellMoveResizeRange = ar.clone(true);
						if (colByX < ar.c1) { colByX = ar.c1; }
						else if (colByX > ar.c2) { colByX = ar.c2; }
						if (rowByY < ar.r1) { rowByY = ar.r1; }
						else if (rowByY > ar.r2) { rowByY = ar.r2; }
						this.startCellMoveResizeRange2 = asc_Range(colByX, rowByY, colByX, rowByY);	
					}
					return null;
				}

				// Очищаем выделение, будем рисовать заново
				// this.cleanSelection();
				this.overlayCtx.clear();
				
				if( targetInfo.cursor == kCurNEResize || targetInfo.cursor == kCurSEResize ){
					if( colByX < this.startCellMoveResizeRange2.c1 ){
						ar.c2 = this.startCellMoveResizeRange2.c1;
						ar.c1 = colByX;
					}
					else if( colByX > this.startCellMoveResizeRange2.c1 ){
						ar.c1 = this.startCellMoveResizeRange2.c1;
						ar.c2 = colByX;
					}
					else{
						ar.c1 = this.startCellMoveResizeRange2.c1;
						ar.c2 = this.startCellMoveResizeRange2.c1
					}
					
					if( rowByY < this.startCellMoveResizeRange2.r1 ){
						if(this.visibleRange.r2 > ar.r2)
							ar.r2 = this.startCellMoveResizeRange2.r2;
						ar.r1 = rowByY;
					}
					else if( rowByY > this.startCellMoveResizeRange2.r1 ){
						if(this.visibleRange.r1 < ar.r1)
							ar.r1 = this.startCellMoveResizeRange2.r1;
							
						if(this.visibleRange.r2 > ar.r2)
							ar.r2 = rowByY;
					}
					else{
						ar.r1 = this.startCellMoveResizeRange2.r1;
						ar.r2 = this.startCellMoveResizeRange2.r1;
					}
				}
				else{
					this.startCellMoveResizeRange.normalize();
					var colDelta = colByX - this.startCellMoveResizeRange2.c1;
					var rowDelta = rowByY - this.startCellMoveResizeRange2.r1;

					ar.c1 = this.startCellMoveResizeRange.c1+colDelta;
					if (0 > ar.c1) {
						colDelta -= ar.c1;
						ar.c1 = 0;
					}
					ar.c2 = this.startCellMoveResizeRange.c2+colDelta;

					ar.r1 = this.startCellMoveResizeRange.r1+rowDelta;
					if (0 > ar.r1) {
						rowDelta -= ar.r1;
						ar.r1 = 0;
					}
					ar.r2 = this.startCellMoveResizeRange.r2+rowDelta;
					
					d = { deltaX : ar.c1 <= this.visibleRange.c1 ? ar.c1-this.visibleRange.c1 : 
																					ar.c2>=this.visibleRange.c2 ? ar.c2-this.visibleRange.c2 : 0,
						  deltaY : ar.r1 <= this.visibleRange.r1 ? ar.r1-this.visibleRange.r1 : 
																					ar.r2>=this.visibleRange.r2 ? ar.r2-this.visibleRange.r2 : 0
						}
				}
				
				if( 0 == targetInfo.targetArr ){	
					var _p = this.arrActiveFormulaRanges[indexFormulaRange].cursorePos,
						_l = this.arrActiveFormulaRanges[indexFormulaRange].formulaRangeLength,
						_a = this.arrActiveFormulaRanges[indexFormulaRange].isAbsolute;
					this.arrActiveFormulaRanges[indexFormulaRange] = ar.clone(true);
					this.arrActiveFormulaRanges[indexFormulaRange].cursorePos = _p;
					this.arrActiveFormulaRanges[indexFormulaRange].formulaRangeLength = _l;
					this.arrActiveFormulaRanges[indexFormulaRange].isAbsolute = _a;
					ret = this.arrActiveFormulaRanges[indexFormulaRange];
				}
				else{
					this.arrActiveChartsRanges[indexFormulaRange] = ar.clone(true);
					this.moveRangeDrawingObjectTo = ar;
				}
				this._drawSelection();
				
				// слой c объектами должен быть выше селекта
				this.objectRender.raiseLayerDrawingObjects(false);
				
				return { ar: ret, d:d };
			},

			/* Функция для применения перемещения диапазона */
			applyMoveRangeHandle: function (ctrlKey) {
				var t = this;
				
				if (null === t.activeMoveRange) {
					// Сбрасываем параметры
					t.startCellMoveRange = null;
					return;
				}

				var arnFrom = t.activeRange.clone(true);
				var arnTo = t.activeMoveRange.clone(true);
				var resmove = t.model._prepareMoveRange(arnFrom, arnTo);
				if( resmove == -2 ){
					t.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.CannotMoveRange, c_oAscError.Level.NoCritical);
					// Сбрасываем параметры
					t.activeMoveRange = null;
					t.startCellMoveRange = null;
					t.isChanged = true;
					t._updateCellsRange(new Range(0, 0, arnFrom.c2 > arnTo.c2 ? arnFrom.c2 : arnTo.c2,
						arnFrom.r2 > arnTo.r2 ? arnFrom.r2 : arnTo.r2), /*canChangeColWidth*/c_oAscCanChangeColWidth.none);
					// Перерисовываем
					t.cleanSelection();
					t._drawSelection();
					return false;
				}
				else if( resmove == -1 ){
					t.model.workbook.handlers.trigger("asc_onConfirmAction",
													  c_oAscConfirm.ConfirmReplaceRange,
													  function(can){t.moveRangeHandle(arnFrom, arnTo, can, ctrlKey)}
					);
					
				}
				else{
					t.moveRangeHandle(arnFrom, arnTo, true, ctrlKey)
				}

			},
			
			applyMoveResizeRangeHandle:function(target){
				if( -1 == target.targetArr )
					this.objectRender.moveRangeDrawingObject(this.startCellMoveResizeRange, this.moveRangeDrawingObjectTo, true);
				
				this.startCellMoveResizeRange = null;
				this.startCellMoveResizeRange2 = null;
			},
			
			moveRangeHandle: function(arnFrom, arnTo, can, copyRange){
				var t = this;
				var onApplyMoveRangeHandleCallback = function (isSuccess) {
					// Очищаем выделение
					t.cleanSelection();
					
					if (true === isSuccess && !arnFrom.isEqual(arnTo) && can) {
						t.cleanDepCells();
						History.Create_NewPoint();
						History.SetSelection(arnFrom.clone());
						History.SetSelectionRedo(arnTo.clone());
						History.StartTransaction();
						t.model._moveRange(arnFrom, arnTo, copyRange);
						t._updateCellsRange(arnTo);
						t.cleanSelection();
						t.activeRange = arnTo.clone(true);
						t.activeRange.startRow = t.activeRange.r1;
						t.activeRange.startCol = t.activeRange.c1;
						t.objectRender.moveRangeDrawingObject(arnFrom, arnTo, false);
						// Вызываем функцию пересчета для заголовков форматированной таблицы
						t.autoFilters._renameTableColumn(t, arnFrom);
						t.autoFilters._renameTableColumn(t, arnTo);
						t.autoFilters.reDrawFilter(t, arnFrom);
						History.EndTransaction();
					}
					
					// Сбрасываем параметры
					t.activeMoveRange = null;
					t.startCellMoveRange = null;
					t.isChanged = true;
					t._updateCellsRange(new Range(0, 0, arnFrom.c2 > arnTo.c2 ? arnFrom.c2 : arnTo.c2,
						arnFrom.r2 > arnTo.r2 ? arnFrom.r2 : arnTo.r2), /*canChangeColWidth*/c_oAscCanChangeColWidth.none);
					// Перерисовываем
					t.cleanSelection();
					t._drawSelection();
				};
				
				this._isLockedCells ([arnFrom, arnTo], null, onApplyMoveRangeHandleCallback);
			},

			setSelectionInfo: function (prop, val, onlyActive, isLocal) {
				// Проверка глобального лока
				if (this.collaborativeEditing.getGlobalLock())
					return;

				var t = this;
				var checkRange = null;
				var arn = t.activeRange.clone(true);
				arn.startCol = t.activeRange.startCol;
				arn.startRow = t.activeRange.startRow;
				arn.type = t.activeRange.type;
				if (onlyActive) {
					checkRange = new asc_Range(arn.startCol, arn.startRow, arn.startCol, arn.startRow);
				} else {
					if (c_oAscSelectionType.RangeMax === arn.type) {
						checkRange = new asc_Range(0, 0, gc_nMaxCol0, gc_nMaxRow0);
					} else if (c_oAscSelectionType.RangeCol === arn.type) {
						checkRange = new asc_Range(arn.c1, 0, arn.c2, gc_nMaxRow0);
					} else if (c_oAscSelectionType.RangeRow === arn.type) {
						checkRange = new asc_Range(0, arn.r1, gc_nMaxCol0, arn.r2);
					} else {
						checkRange = arn;
					}
				}

				var onSelectionCallback = function (isSuccess) {
					if (false === isSuccess)
						return;
					var range;
					var canChangeColWidth = c_oAscCanChangeColWidth.none;
					var selectionRange;
					var bIsUpdate = true;

					if (onlyActive) {
						range = t.model.getRange3(arn.startRow, arn.startCol, arn.startRow, arn.startCol);
					} else {
						if (c_oAscSelectionType.RangeMax === arn.type) {
							range = t.model.getRange3(/*arn.r1*/0, /*arn.c1*/0, gc_nMaxRow0, gc_nMaxCol0);
						} else if (c_oAscSelectionType.RangeCol === arn.type) {
							range = t.model.getRange3(/*arn.r1*/0, arn.c1, gc_nMaxRow0, arn.c2);
						} else if (c_oAscSelectionType.RangeRow === arn.type) {
							range = t.model.getRange3(arn.r1, /*arn.c1*/0, arn.r2, gc_nMaxCol0);
						} else {
							range = t.model.getRange3(arn.r1, arn.c1, arn.r2, arn.c2);
						}
					}

					var isLargeRange = t._isLargeRange(range), callTrigger = false;
					var res, flag;
					var mc, r, c, cell;

					function makeBorder(b) {
						var border = {};
						if (b === false) {
							border.s = kcbNone;
						} else if (b) {
							if (b.style !== null && b.style !== undefined) {border.s = b.style;}
							if (b.color !== null && b.color !== undefined) {
								if(b.color instanceof CAscColor)
									border.c = CorrectAscColor(b.color);
							}
							flag = flag || (b.width === null || b.style === null || b.color === null);
						}
						return border;
					}

					selectionRange = arn.clone();
					t.model.onStartTriggerAction();
					History.Create_NewPoint();
					History.StartTransaction();

					switch (prop) {
						case "fn": range.setFontname(val); canChangeColWidth = c_oAscCanChangeColWidth.numbers; break;
						case "fs": range.setFontsize(val); canChangeColWidth = c_oAscCanChangeColWidth.numbers; break;
						case "b":  range.setBold(val); break;
						case "i":  range.setItalic(val); break;
						case "u":  range.setUnderline(val); break;
						case "s":  range.setStrikeout(val); break;
						case "fa": range.setFontAlign(val); break;
						case "a":  range.setAlignHorizontal(val); break;
						case "va": range.setAlignVertical(val); break;
						case "c":  range.setFontcolor(val); break;
						case "bc": range.setFill((val) ? (val) : null); break;
						case "wrap":   range.setWrap(val); break;
						case "shrink": range.setShrinkToFit(val); break;
						case "value":  range.setValue(val); break;
						case "format": range.setNumFormat(val); canChangeColWidth = c_oAscCanChangeColWidth.numbers; break;
                        case "angle": range.setAngle(val); break;

						case "border":
							if (isLargeRange) { callTrigger = true; t._trigger("slowOperation", true); }
							res = {};
							flag = false;
							// None
							if (val.length < 1) {
								range.setBorder(null);
								break;
							}
							// Diagonal
							res.d = makeBorder( val[c_oAscBorderOptions.DiagD] || val[c_oAscBorderOptions.DiagU] );
							res.dd = val[c_oAscBorderOptions.DiagD] ? true : false;
							res.du = val[c_oAscBorderOptions.DiagU] ? true : false;
							// Vertical
							res.l = makeBorder( val[c_oAscBorderOptions.Left] );
							res.iv = makeBorder( val[c_oAscBorderOptions.InnerV] );
							res.r = makeBorder( val[c_oAscBorderOptions.Right] );
							// Horizontal
							res.t = makeBorder( val[c_oAscBorderOptions.Top] );
							res.ih = makeBorder( val[c_oAscBorderOptions.InnerH] );
							res.b = makeBorder( val[c_oAscBorderOptions.Bottom] );
							// Change border
							range.setBorder(res, flag);
							break;
						case "merge":
							if (isLargeRange) { callTrigger = true; t._trigger("slowOperation", true); }
							switch (val) {
								case c_oAscMergeOptions.Unmerge:     range.unmerge(); break;
								case c_oAscMergeOptions.MergeCenter: range.merge(val); break;
								case c_oAscMergeOptions.MergeAcross:
									for (res = arn.r1; res <= arn.r2; ++res)
									{
										t.model.getRange3(res, arn.c1, res, arn.c2).merge(val);
									}
									break;
								case c_oAscMergeOptions.Merge:       range.merge(val); break;
							}
							// Должны обновить больший range, т.к. мы продолжаем строки в ячейках...
							arn.c1 = 0;
							arn.c2 = gc_nMaxCol0;
							break;

						case "sort":
							if (isLargeRange) { callTrigger = true; t._trigger("slowOperation", true); }
							var changes = range.sort(val, arn.startCol);
							t.cellCommentator.sortComments(arn, changes);
							break;

						case "empty":
							if (isLargeRange) { callTrigger = true; t._trigger("slowOperation", true); }
							/* отключаем отрисовку на случай необходимости пересчета ячеек, заносим ячейку, при необходимости в список перерисовываемых */
							lockDraw(t.model.workbook);
							if (val === c_oAscCleanOptions.All)
								range.cleanAll();
							if (val & c_oAscCleanOptions.Text || val & c_oAscCleanOptions.Formula)
								range.cleanText();
							if (val & c_oAscCleanOptions.Format)
								range.cleanFormat();

							// Если нужно удалить автофильтры - удаляем
							t.autoFilters.isEmptyAutoFilters(t, arn);
							// Вызываем функцию пересчета для заголовков форматированной таблицы
							t.autoFilters._renameTableColumn(t, arn);

							/* возвращаем отрисовку. и перерисовываем ячейки с предварительным пересчетом */
							helpFunction(t.model.workbook);
							unLockDraw(t.model.workbook);

							// Должны обновить больший range, т.к. мы продолжаем строки в ячейках...
							arn.c1 = t.visibleRange.c1;
							arn.c2 = t.visibleRange.c2;
							break;

						case "changeDigNum":
							res = t.cols.slice(arn.c1, arn.c2+1).reduce(function(r,c){r.push(c.charCount);return r;}, []);
							range.shiftNumFormat(val, res);
							canChangeColWidth = c_oAscCanChangeColWidth.numbers;
							break;
						case "changeFontSize":
							mc = t._getMergedCellsRange(arn.startCol, arn.startRow);
							c = mc ? mc.c1 : arn.startCol;
							r = mc ? mc.r1 : arn.startRow;
							cell = t._getVisibleCell(c, r);
							if (undefined !== cell) {
								var oldFontSize = cell.getFontsize();
								var newFontSize = asc_incDecFonSize(val, oldFontSize);
								if (null !== newFontSize) {
									range.setFontsize(newFontSize);
									canChangeColWidth = c_oAscCanChangeColWidth.numbers;
								}
							}
							break;
						case "paste":
							var pasteExec = function()
							{
								if (isLargeRange) { callTrigger = true; t._trigger("slowOperation", true); }
								var selectData;
								if(isLocal)
									selectData = t._pasteFromLS(val);
								else
									selectData = t._setInfoAfterPaste(val,onlyActive);

								if (!selectData) {
									bIsUpdate = false;
									History.EndTransaction();
									t.model.onEndTriggerAction();
									return;
								}
								t.expandColsOnScroll();
								t.expandRowsOnScroll();
								var arrFormula = selectData[1];
								lockDraw(t.model.workbook);
								for (var i = 0; i < arrFormula.length; ++i) {//!!!
									var rangeF = arrFormula[i].range;
									var valF = arrFormula[i].val;
									if(rangeF.isOneCell())
										rangeF.setValue(valF);
									else
									{
										var oBBox = rangeF.getBBox0();
										t.model._getCell(oBBox.r1, oBBox.c1).setValue(valF);
									}
								}
								helpFunction(t.model.workbook);
								unLockDraw(t.model.workbook);
								arn = selectData[0];
								selectionRange = arn.clone(true);

								// Должны обновить больший range, т.к. мы продолжаем строки в ячейках...
								arn.c1 = 0;
								arn.c2 = gc_nMaxCol0;
								if (bIsUpdate) {
									if (callTrigger) { t._trigger("slowOperation", false); }
									t.isChanged = true;
									t._updateCellsRange(arn, canChangeColWidth);
									t._prepareCellTextMetricsCache(arn);
								}

								History.EndTransaction();
								History.SetSelection(selectionRange);
								t.model.onEndTriggerAction();
							};
							
							//загрузка шрифтов, в случае удачи на callback вставляем текст
							var callbackFunc = function(res) {
								if (res) {
									//t._drawCollaborativeElements(true);
									t._loadFonts(val.fontsNew, function () {
										pasteExec();
										if(val.addImages && val.addImages.length != 0)
										{
											for(var im = 0; im < val.addImages.length; im++)//вставляем изображения
											{
												var src = val.addImages[im].tag.src;
												if(src && 0 != src.indexOf("file://"))
													t.objectRender.addImageDrawingObject(src, true, { cell: val.addImages[im].curCell, width: val.addImages[im].tag.width, height: val.addImages[im].tag.height });
											}
										}
									});
								}
								else
								{
									History.EndTransaction();
									t.model.onEndTriggerAction();
								}
							};
							var api = window["Asc"]["editor"];
							if(isLocal)//вставляем текст из локального буфера
								pasteExec();
							else
							{
								if(val.addImages == null || api.isChartEditor)//нет изображений
								{
									callbackFunc(true);
								}
								else//присутвуют изображения
								{
									t.collaborativeEditing.onStartCheckLock();
									
									//на callback грузим шрифты и осуществляем вставку текста
									if (false === t.collaborativeEditing.getCollaborativeEditing()) {
										// Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
										callbackFunc(true);
										
										callbackFunc = undefined;
										return;
									}

									t.collaborativeEditing.onEndCheckLock(callbackFunc);
								}
							}
							return;
						case "hyperlink":
							if (val) {
								var type = (c_oAscHyperlinkType.RangeLink !== val.asc_getType()) ? c_oAscHyperlinkType.WebLink : c_oAscHyperlinkType.RangeLink;
								var location = null;
								if (c_oAscHyperlinkType.RangeLink === type) {
									var hyperlinkRangeTmp = t.model.getRange2(val.asc_getRange ());
									if (null === hyperlinkRangeTmp) {
										bIsUpdate = false;
										break;
									}
									var hyperlinkRangeBBox0 = hyperlinkRangeTmp.getBBox0();
									var hyperlinkRange = t._getCellTitle(hyperlinkRangeBBox0.c1, hyperlinkRangeBBox0.r1);
									if (hyperlinkRangeBBox0.c1 !== hyperlinkRangeBBox0.c2 || hyperlinkRangeBBox0.r1 !== hyperlinkRangeBBox0.r2)
										hyperlinkRange += ":" + t._getCellTitle(hyperlinkRangeBBox0.c2, hyperlinkRangeBBox0.r2);
									location = val.asc_getSheet() + "!" + hyperlinkRange;
								}
								var newHyperlink = new Hyperlink();
								newHyperlink.Hyperlink = val.asc_getHyperlinkUrl();
								newHyperlink.Location = location;
								newHyperlink.Ref = range;
								newHyperlink.Tooltip = val.asc_getTooltip();
								range.setHyperlink(newHyperlink);
								// Вставим текст в активную ячейку (а не так, как MSExcel в первую ячейку диапазона)
								mc = t._getMergedCellsRange(arn.startCol, arn.startRow);
								c = mc ? mc.c1 : arn.startCol;
								r = mc ? mc.r1 : arn.startRow;
								if (null !== val.asc_getText()) {
									t.model.getRange3(r, c, r, c)
										.setValue(val.asc_getText());

									// Вызываем функцию пересчета для заголовков форматированной таблицы
									t.autoFilters._renameTableColumn(t, arn);
								}
								break;
							} else {
								bIsUpdate = false;
								break;
							}

						default:
							bIsUpdate = false;
							break;
					}

					if (bIsUpdate) {
						if (callTrigger) { t._trigger("slowOperation", false); }
						t.isChanged = true;
						t._updateCellsRange(arn, canChangeColWidth);
					}

					History.EndTransaction();
					History.SetSelection(selectionRange);
					t.model.onEndTriggerAction();
				};
				if ("paste" === prop) {
					// Для past свой диапазон
					if(isLocal)
						checkRange = t._pasteFromLS(val, true);
					else
						checkRange = t._setInfoAfterPaste(val, onlyActive, true);
				}
				this._isLockedCells (checkRange, /*subType*/null, onSelectionCallback);
			},

			_setInfoAfterPaste: function (values,clipboard,isCheckSelection) {
				var t = this;
				var arn = t.activeRange.clone(true);
				var arrFormula = [];
				var numFor = 0;
				var rMax = values.length + values.rowSpanSpCount;
				if(values.rowCount && values.rowCount !== 0 && values.isOneTable)
					rMax = values.rowCount + arn.r1;

				var cMax = values.cellCount + arn.c1;

				var isMultiple = false;
				var firstCell = t.model.getRange3(arn.r1, arn.c1, arn.r1, arn.c1);
				var isMergedFirstCell = firstCell.hasMerged();
				var rangeUnMerge = t.model.getRange3(arn.r1, arn.c1, rMax - 1, cMax - 1);
				var isOneMerge = false;


				//если вставляем в мерженную ячейку, диапазон которой больше или равен
				if (arn.c2 >= cMax -1 && arn.r2 >= rMax - 1 &&
				    isMergedFirstCell && isMergedFirstCell.c1 === arn.c1 && isMergedFirstCell.c2 === arn.c2 && isMergedFirstCell.r1 === arn.r1 && isMergedFirstCell.r2 === arn.r2 &&
				    cMax - arn.c1 === values[arn.r1][arn.c1][0].colSpan && rMax - arn.r1  === values[arn.r1][arn.c1][0].rowSpan)
				{
					if(!isCheckSelection)
					{
					values[arn.r1][arn.c1][0].colSpan = isMergedFirstCell.c2 -isMergedFirstCell.c1 + 1;
					values[arn.r1][arn.c1][0].rowSpan = isMergedFirstCell.r2 -isMergedFirstCell.r1 + 1;
					}
					isOneMerge = true;
				}
				else if(arn.c2 >= cMax -1 && arn.r2 >= rMax - 1  && values.isOneTable)
				{
					//если область кратная куску вставки
					var widthArea = arn.c2 - arn.c1 + 1;
					var heightArea = arn.r2 - arn.r1 + 1;
					var widthPasteFr = cMax -  arn.c1;
					var heightPasteFr =  rMax -  arn.r1;
					//если кратны, то обрабатываем
					if(widthArea%widthPasteFr === 0 && heightArea%heightPasteFr === 0)
					{
						isMultiple = true;
					}
					else if(firstCell.hasMerged() !== null)//в противном случае ошибка
					{
						if(isCheckSelection)
						{
							return arn;
						}
						else
						{
							this._trigger ("onError", c_oAscError.ID.PastInMergeAreaError, c_oAscError.Level.NoCritical);
							return;
						}
					}
				}
				else
				{
				//проверка на наличие части объединённой ячейки в области куда осуществляем вставку
					for (var rFirst = arn.r1;rFirst < rMax; ++rFirst) {
						for (var cFirst = arn.c1; cFirst < cMax; ++cFirst) {
							range = t.model.getRange3(rFirst, cFirst, rFirst, cFirst);
							var merged = range.hasMerged();
							if(merged)
							{
								if(merged.r1 < arn.r1 || merged.r2 > rMax - 1 || merged.c1 < arn.c1 || merged.c2 > cMax-1)
								{
									//ошибка в случае если вставка происходит в часть объедененной ячейки
									if(isCheckSelection)
									{
										return arn;
									}
									else
									{
										this._trigger ("onErrorEvent", c_oAscError.ID.PastInMergeAreaError, c_oAscError.Level.NoCritical);
										return;
									}
								}
							}
						}
					}
				}
				var rMax2 = rMax;
				var cMax2 = cMax;
				var rMax = values.length;
				var trueArn = t.activeRange;
				if(isCheckSelection)
				{
					var newArr = arn.clone(true);
					newArr.r2 = rMax2 - 1;
					newArr.c2 = cMax2 -1;
					if(isMultiple || isOneMerge)
					{
						newArr.r2 = trueArn.r2;
						newArr.c2 = trueArn.c2;
					}
					return newArr;
				}
				//если не возникает конфликт, делаем unmerge
				rangeUnMerge.unmerge();
				if(!isOneMerge)
				{
					arn.r2 = rMax2 - 1;
					arn.c2 = cMax2 -1;
				}

				var mergeArr = [];

				var n = 0;
				if(isMultiple)//случай автозаполнения сложных форм
				{
					t.model.getRange3(trueArn.r1, trueArn.c1, trueArn.r2, trueArn.c2).unmerge();
					var maxARow = heightArea/heightPasteFr;
					var maxACol = widthArea/widthPasteFr;
					var plRow = (rMax2 - arn.r1);
					var plCol = (arn.c2 - arn.c1) + 1;
				}
				else
				{
					var maxARow = 1;
					var maxACol = 1;
					var plRow = 0;
					var plCol = 0;
				}
				if(isMultiple)
				{
					var currentObj = values[arn.r1][arn.c1][0];
					var valFormat = '';
					if(currentObj[0] !== undefined)
						valFormat = currentObj[0].text;
					if(currentObj.format !== null && currentObj.format !== '' && currentObj.format !== undefined)
					{
						var nameFormat = clipboard._decode(currentObj.format.split(';')[0]);
						valFormat = clipboard._decode(currentObj.format.split(';')[1]);
					}
				}
				for (var autoR = 0;autoR < maxARow; ++autoR) {
					for (var autoC = 0;autoC < maxACol; ++autoC) {
						for (var r = arn.r1;r < rMax; ++r) {
							for (var c = arn.c1; c < values[r].length; ++c) {
								if(undefined !== values[r][c])
								{
									var range = t.model.getRange3(r + autoR*plRow, c + autoC*plCol, r + autoR*plRow, c + autoC*plCol);

									var res, flag, v;

									var currentObj = values[r][c][0];
									if( currentObj.length === 1 ){
										//if(!isMultiple)
										//{
											var valFormat = currentObj[0].text;
											var nameFormat = false;
											if(currentObj.format !== null && currentObj.format !== '' && currentObj.format !== undefined)
											{
												nameFormat = clipboard._decode(currentObj.format.split(';')[0]);
												valFormat = clipboard._decode(currentObj.format.split(';')[1]);
											}
										//}
										if( currentObj[0].cellFrom ){
											var offset = range.getCells()[0].getOffset2(currentObj[0].cellFrom),
												assemb,
												_p_ = new parserFormula(currentObj[0].text.substring(1),"",range.worksheet);

											if( _p_.parse() ){
												assemb = _p_.changeOffset(offset).assemble();
												//range.setValue("="+assemb);
												arrFormula[numFor] = {};
												arrFormula[numFor].range = range;
												arrFormula[numFor].val = "=" + assemb;
												numFor++;
												delete _p_;
											}
											else{
												delete _p_;
											}
										}
										else
											range.setValue(valFormat);
										if(nameFormat)
											range.setNumFormat(nameFormat);
										range.setBold(currentObj[0].format.b);
										range.setItalic(currentObj[0].format.i);
										range.setStrikeout(currentObj[0].format.s);
										if(!isOneMerge && currentObj[0].format && currentObj[0].format.c != null && currentObj[0].format.c != undefined && asc_parsecolor(currentObj[0].format.c) != null)
											range.setFontcolor(new RgbColor(asc_parsecolor(currentObj[0].format.c).binary));
										range.setUnderline(currentObj[0].format.u);
										range.setAlignVertical(currentObj.va);
										range.setFontname(currentObj[0].format.fn);
										range.setFontsize(currentObj[0].format.fs);
									}
									else{
										range.setValue2(currentObj);
										range.setAlignVertical(currentObj.va);
									}

									if(currentObj.length === 1 && currentObj[0].format.fs !== '' && currentObj[0].format.fs !== null && currentObj[0].format.fs !== undefined)
										range.setFontsize(currentObj[0].format.fs)
									if(!isOneMerge)
										range.setAlignHorizontal(currentObj.a);
									var isMerged = false;
									for(mergeCheck = 0; mergeCheck < mergeArr.length; ++mergeCheck)
									{
										if(r + 1 + autoR*plRow <= mergeArr[mergeCheck].r2 && r + 1 + autoR*plRow >= mergeArr[mergeCheck].r1 && c + autoC*plCol + 1 <= mergeArr[mergeCheck].c2 && c + 1 + autoC*plCol >= mergeArr[mergeCheck].c1)
											isMerged = true;
									}

									//обработка для мерженных ячеек
									if((currentObj.colSpan > 1 || currentObj.rowSpan > 1) && !isMerged)
									{
										range.setOffsetLast({offsetCol: currentObj.colSpan -1, offsetRow: currentObj.rowSpan -1});
										mergeArr[n] = {
											r1: range.first.row,
											r2: range.last.row,
											c1: range.first.col,
											c2: range.last.col
										};
										n++;
										if(currentObj[0] == undefined)
											range.setValue('');
										range.merge(c_oAscMergeOptions.Merge);
									}
									//range.setBorder(null);
									if(!isOneMerge)
										range.setBorderSrc(currentObj.borders, false);
									range.setWrap(currentObj.wrap);
									if(currentObj.bc && currentObj.bc != 'rgba(0, 0, 0, 0)' && currentObj.bc != 'transparent' && '' != currentObj.bc && !isOneMerge)
										range.setFill(new RgbColor(asc_parsecolor(currentObj.bc).binary));
										var link = values[r][c][0].hyperLink;
									if(link)
									{
										var newHyperlink = new Hyperlink();
										if(values[r][c][0].hyperLink.search('#') === 0)
											newHyperlink.Location = link.replace('#','');
										else
											newHyperlink.Hyperlink = link;
										newHyperlink.Ref = range;
										newHyperlink.Tooltip = values[r][c][0].toolTip;
										range.setHyperlink(newHyperlink);
									}
								}
							}
						}
					}
				}
				if(isMultiple)
				{
					arn.r2 = trueArn.r2;
					arn.c2 = trueArn.c2;
				}

				t.isChanged = true;
				t.activeRange.c2 = arn.c2;
				t.activeRange.r2 = arn.r2;
				var arnFor = [];
				arnFor[0] = arn;
				arnFor[1] = arrFormula;
				return arnFor;
			},

			_pasteFromLS: function(val,isCheckSelection){
				var t = this;
				var arn = t.activeRange.clone(true);
				var arrFormula = [];
				var numFor = 0;
				var rMax = val.lStorage.length + arn.r1;

				var cMax = val.lStorage[0].length + arn.c1;
				var values = val.lStorage;

				var isMultiple = false;
				var firstCell = t.model.getRange3(arn.r1, arn.c1, arn.r1, arn.c1);
				var isMergedFirstCell = firstCell.hasMerged();
				var rangeUnMerge = t.model.getRange3(arn.r1, arn.c1, rMax - 1, cMax - 1);
				var isOneMerge = false;


				var firstValuesCol;
				var firstValuesRow;
				if(values[0][0].merge != null)
				{
					firstValuesCol = values[0][0].merge.c2-values[0][0].merge.c1;
					firstValuesRow = values[0][0].merge.r2-values[0][0].merge.r1;
				}
				else
				{
					firstValuesCol = 0;
					firstValuesRow = 0;
				}

				//если вставляем в мерженную ячейку, диапазон которой больше или равен
				if (arn.c2 >= cMax -1 && arn.r2 >= rMax - 1 &&
				isMergedFirstCell && isMergedFirstCell.c1 === arn.c1 && isMergedFirstCell.c2 === arn.c2 && isMergedFirstCell.r1 === arn.r1 && isMergedFirstCell.r2 === arn.r2 &&
				cMax - arn.c1 === (firstValuesCol + 1) && rMax - arn.r1  === (firstValuesRow + 1))
				{
					if(!isCheckSelection)
					{
						/*values[0][0].merge =
						{
							r1: 0,
							r2: isMergedFirstCell.r2 -isMergedFirstCell.r1,
							c1: 0,
							c2: isMergedFirstCell.c2 -isMergedFirstCell.c1
						}*/
						/*val[0][0].colSpan = isMergedFirstCell.c2 -isMergedFirstCell.c1 + 1;
						val[0][0].rowSpan = isMergedFirstCell.r2 -isMergedFirstCell.r1 + 1;*/
					}
					isOneMerge = true;
				}
				else if(arn.c2 >= cMax -1 && arn.r2 >= rMax - 1)
				{
					//если область кратная куску вставки
					var widthArea = arn.c2 - arn.c1 + 1;
					var heightArea = arn.r2 - arn.r1 + 1;
					var widthPasteFr = cMax -  arn.c1;
					var heightPasteFr =  rMax -  arn.r1;
					//если кратны, то обрабатываем
					if(widthArea%widthPasteFr === 0 && heightArea%heightPasteFr === 0)
					{
						isMultiple = true;
					}
					else if(firstCell.hasMerged() !== null)//в противном случае ошибка
					{
						if(isCheckSelection)
						{
							return arn;
						}
						else
						{
							this._trigger ("onError", c_oAscError.ID.PastInMergeAreaError, c_oAscError.Level.NoCritical);
							return;
						}
					}
				}
				else
				{
				//проверка на наличие части объединённой ячейки в области куда осуществляем вставку
					for (var rFirst = arn.r1;rFirst < rMax; ++rFirst) {
						for (var cFirst = arn.c1; cFirst < cMax; ++cFirst) {
							range = t.model.getRange3(rFirst, cFirst, rFirst, cFirst);
							var merged = range.hasMerged();
							if(merged)
							{
								if(merged.r1 < arn.r1 || merged.r2 > rMax - 1 || merged.c1 < arn.c1 || merged.c2 > cMax-1)
								{
									//ошибка в случае если вставка происходит в часть объедененной ячейки
									if(isCheckSelection)
									{
										return arn;
									}
									else
									{
										this._trigger ("onErrorEvent", c_oAscError.ID.PastInMergeAreaError, c_oAscError.Level.NoCritical);
										return;
									}
								}
							}
						}
					}
				}
				var rMax2 = rMax;
				var cMax2 = cMax;
				//var rMax = values.length;
				var trueArn = t.activeRange;
				if(isCheckSelection)
				{
					var newArr = arn.clone(true);
					newArr.r2 = rMax2 - 1;
					newArr.c2 = cMax2 - 1;
					if(isMultiple || isOneMerge)
					{
						newArr.r2 = trueArn.r2;
						newArr.c2 = trueArn.c2;
					}
					return newArr;
				}
				//если не возникает конфликт, делаем unmerge
				rangeUnMerge.unmerge();
				if(!isOneMerge)
				{
					arn.r2 = rMax2 - 1;
					arn.c2 = cMax2 -1;
				}

				var mergeArr = [];

				var n = 0;
				if(isMultiple)//случай автозаполнения сложных форм
				{
					t.model.getRange3(trueArn.r1, trueArn.c1, trueArn.r2, trueArn.c2).unmerge();
					var maxARow = heightArea/heightPasteFr;
					var maxACol = widthArea/widthPasteFr;
					var plRow = (rMax2 - arn.r1);
					var plCol = (arn.c2 - arn.c1) + 1;
				}
				else
				{
					var maxARow = 1;
					var maxACol = 1;
					var plRow = 0;
					var plCol = 0;
				}
				/*if(isMultiple)
				{
					var currentObj = values[arn.r1][arn.c1][0];
					var valFormat = '';
					if(currentObj[0] !== undefined)
						valFormat = currentObj[0].text;
					if(currentObj.format !== null && currentObj.format !== '' && currentObj.format !== undefined)
					{
						var nameFormat = clipboard._decode(currentObj.format.split(';')[0]);
						valFormat = clipboard._decode(currentObj.format.split(';')[1]);
					}
				}*/
				for (var autoR = 0;autoR < maxARow; ++autoR) {
					for (var autoC = 0;autoC < maxACol; ++autoC) {
						for (var r = arn.r1;r < rMax; ++r) {
							for (var c = arn.c1; c < cMax; ++c) {
								var newVal = values[r - arn.r1][c - arn.c1];
								if(undefined !== newVal)
								{
									var isMerged = false;
									var range = t.model.getRange3(r + autoR*plRow, c + autoC*plCol, r + autoR*plRow, c + autoC*plCol);
									if(!isOneMerge)
									{
										for(mergeCheck = 0; mergeCheck < mergeArr.length; ++mergeCheck)
										{
											if(r + autoR*plRow <= mergeArr[mergeCheck].r2 && r + autoR*plRow >= mergeArr[mergeCheck].r1 && c + autoC*plCol  <= mergeArr[mergeCheck].c2 && c + autoC*plCol >= mergeArr[mergeCheck].c1)
												isMerged = true;
										}
										if(newVal.merge != null && !isMerged)
										{
											range.setOffsetLast({offsetCol: (newVal.merge.c2 - newVal.merge.c1), offsetRow: (newVal.merge.r2 - newVal.merge.r1)});
											range.merge(c_oAscMergeOptions.Merge);
											mergeArr[n] = {
												r1: newVal.merge.r1 + arn.r1 - values.fromRow + autoR*plRow,
												r2: newVal.merge.r2 + arn.r1 - values.fromRow + autoR*plRow,
												c1: newVal.merge.c1 + arn.c1 - values.fromCol + autoC*plCol,
												c2: newVal.merge.c2 + arn.c1 - values.fromCol + autoC*plCol
											};
											n++;
										}
									}
									else
									{
										for(mergeCheck = 0; mergeCheck < mergeArr.length; ++mergeCheck)
										{
											if(r + autoR*plRow <= mergeArr[mergeCheck].r2 && r + autoR*plRow >= mergeArr[mergeCheck].r1 && c + autoC*plCol  <= mergeArr[mergeCheck].c2 && c + autoC*plCol >= mergeArr[mergeCheck].c1)
												isMerged = true;
										}
										if(!isMerged)
										{
											range.setOffsetLast({offsetCol: (isMergedFirstCell.c2 -isMergedFirstCell.c1), offsetRow: (isMergedFirstCell.r2 -isMergedFirstCell.r1)});
											range.merge(c_oAscMergeOptions.Merge);
											mergeArr[n] = {
												r1: isMergedFirstCell.r1,
												r2: isMergedFirstCell.r2,
												c1: isMergedFirstCell.c1,
												c2: isMergedFirstCell.c2
											};
											n++;
										}
									}
									//add formula
									var numFormula = null;
									var skipFormat = null;
									var noSkipVal = null;
									for(var nF = 0; nF < newVal.value2.length;nF++)
									{
										if(newVal.value2[nF] && newVal.value2[nF].sId)
										{	
											numFormula = nF;
											break;
										}
										else if(newVal.value2[nF] && newVal.value2[nF].format && newVal.value2[nF].format.skip)
											skipFormat = true;
										else if(newVal.value2[nF] && newVal.value2[nF].format && !newVal.value2[nF].format.skip)
											noSkipVal = nF;
									}
									
									if(newVal.value2.length == 1 || numFormula != null || (skipFormat != null && noSkipVal!= null))
									{
										if(numFormula == null)
											numFormula = 0;
										var numStyle = 0;
										if(skipFormat != null && noSkipVal!= null)
											numStyle = noSkipVal;
										if( newVal.value2[numFormula].sId){
											var offset = range.getCells()[numFormula].getOffset2(newVal.value2[numFormula].sId),
												assemb,
												_p_ = new parserFormula(newVal.value2[numFormula].sFormula,"",range.worksheet);

											if( _p_.parse() ){
												assemb = _p_.changeOffset(offset).assemble();
												//range.setValue("="+assemb);
												arrFormula[numFor] = {};
												arrFormula[numFor].range = range;
												arrFormula[numFor].val = "=" + assemb;
												numFor++;
												delete _p_;
											}
											else{
												delete _p_;
											}
										}
										else if(newVal.valWithoutFormat)
											range.setValue(newVal.valWithoutFormat);
										else
											range.setValue(newVal.value2[numStyle].text);

										range.setBold(newVal.value2[numStyle].format.b);
										range.setItalic(newVal.value2[numStyle].format.i);
										range.setStrikeout(newVal.value2[numStyle].format.s);
										if(!isOneMerge && newVal.value2[numStyle].format && newVal.value2[numStyle].format.c != null && newVal.value2[numStyle].format.c != undefined)
											range.setFontcolor(new RgbColor(asc_parsecolor(newVal.value2[numStyle].format.c).binary));
										range.setUnderline(newVal.value2[numStyle].format.u);
										//range.setAlignVertical(currentObj.va);
										range.setFontname(newVal.value2[numStyle].format.fn);
										range.setFontsize(newVal.value2[numStyle].format.fs);
									}
									else
										range.setValue2(newVal.value2);

									range.setAlignVertical(newVal.verAlign);
									if(!isOneMerge)
										range.setAlignHorizontal(newVal.horAlign);
									if(!isOneMerge)
										range.setBorderSrc(newVal.borders, false);

									var nameFormat;
									/*if(newVal.format.oPositiveFormat)
									{
										var output = new Object();
										var bRes = newVal.format.shiftFormat(output, 0);
										if(true == bRes)
											nameFormat = output.format;									
									}*/
									if(newVal.format && newVal.format.sFormat)
										nameFormat = newVal.format.sFormat;
									if(nameFormat)
										range.setNumFormat(nameFormat);
									range.setFill(newVal.fill);

									range.setWrap(newVal.wrap);

									if(newVal.hyperlink != null)
									{
										newVal.hyperlink.Ref = range;
										range.setHyperlink(newVal.hyperlink);
									}
								}
							}
						}
					}
				}
				if(isMultiple)
				{
					arn.r2 = trueArn.r2;
					arn.c2 = trueArn.c2;
				}

				t.isChanged = true;
				t.activeRange.c2 = arn.c2;
				t.activeRange.r2 = arn.r2;
				var arnFor = [];
				arnFor[0] = arn;
				arnFor[1] = arrFormula;
				return arnFor;

			},

			// Залочен ли весь лист
			_isLockedAll: function (callback) {
				if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
					// Запрещено совместное редактирование
					if ($.isFunction(callback)) {callback(true);}
					return;
				}
				var sheetId = this.model.getId();
				var subType = c_oAscLockTypeElemSubType.ChangeProperties;
				var ar = this.activeRange;

				var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/subType,
					sheetId, new asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));

				if (false === this.collaborativeEditing.getCollaborativeEditing()) {
					// Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
					if ($.isFunction(callback)) {callback(true);}
					callback = undefined;
				} else if (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
					c_oAscLockTypes.kLockTypeMine, /*bCheckOnlyLockAll*/true)) {
					// Редактируем сами
					if ($.isFunction(callback)) {callback(true);}
					return;
				} else if (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
					c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/true)) {
					// Уже ячейку кто-то редактирует
					if ($.isFunction(callback)) {callback(false);}
					return;
				}

				this.collaborativeEditing.onStartCheckLock();
				this.collaborativeEditing.addCheckLock(lockInfo);
				this.collaborativeEditing.onEndCheckLock(callback);
			},
			// Пересчет для входящих ячеек в добавленные строки/столбцы
			_recalcRangeByInsertRowsAndColumns: function (sheetId, ar) {
				var isIntersection = false, isIntersectionC1 = true, isIntersectionC2 = true,
					isIntersectionR1 = true, isIntersectionR2 = true;
				do {
					if (isIntersectionC1 && this.collaborativeEditing.isIntersectionInCols(sheetId, ar.c1))
						ar.c1 += 1;
					else
						isIntersectionC1 = false;

					if (isIntersectionR1 && this.collaborativeEditing.isIntersectionInRows(sheetId, ar.r1))
						ar.r1 += 1;
					else
						isIntersectionR1 = false;

					if (isIntersectionC2 && this.collaborativeEditing.isIntersectionInCols(sheetId, ar.c2))
						ar.c2 -= 1;
					else
						isIntersectionC2 = false;

					if (isIntersectionR2 && this.collaborativeEditing.isIntersectionInRows(sheetId, ar.r2))
						ar.r2 -= 1;
					else
						isIntersectionR2 = false;


					if (ar.c1 > ar.c2 || ar.r1 > ar.r2) {
						isIntersection = true;
						break;
					}
				}
				while (isIntersectionC1 || isIntersectionC2 || isIntersectionR1 || isIntersectionR2)
					;

				if (false === isIntersection) {
					ar.c1 = this.collaborativeEditing.getLockMeColumn(sheetId, ar.c1);
					ar.c2 = this.collaborativeEditing.getLockMeColumn(sheetId, ar.c2);
					ar.r1 = this.collaborativeEditing.getLockMeRow(sheetId, ar.r1);
					ar.r2 = this.collaborativeEditing.getLockMeRow(sheetId, ar.r2);
				}

				return isIntersection;
			},
			// Функция проверки lock (возвращаемый результат нельзя использовать в качестве ответа, он нужен только для редактирования ячейки)
			_isLockedCells: function (range, subType, callback) {
				if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
					// Запрещено совместное редактирование
					if ($.isFunction(callback)) {callback(true);}
					return true;
				}
				var sheetId = this.model.getId();
				var isIntersection = false;
				var newCallback = callback;
				var t = this;

				this.collaborativeEditing.onStartCheckLock();
				var nLength = ("array" === asc_typeof(range)) ? range.length : 1;
				var nIndex = 0;
				var ar = null;

				for (; nIndex < nLength; ++nIndex) {
					ar = ("array" === asc_typeof(range)) ? range[nIndex].clone(true) : range.clone(true);
					
					if (c_oAscLockTypeElemSubType.InsertColumns !== subType && c_oAscLockTypeElemSubType.InsertRows !== subType) {
						// Пересчет для входящих ячеек в добавленные строки/столбцы
						isIntersection = this._recalcRangeByInsertRowsAndColumns(sheetId, ar);
					}

					if (false === isIntersection) {
						var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/subType, sheetId, new asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));

						if (false !== this.collaborativeEditing.getLockIntersection(lockInfo,
							c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false)) {
							// Уже ячейку кто-то редактирует
							if ($.isFunction(callback)) {callback(false);}
							return false;
						} else {
							if (c_oAscLockTypeElemSubType.InsertColumns === subType) {
								newCallback = function (isSuccess) {
									if (isSuccess)
										t.collaborativeEditing.addColsRange(sheetId, range.clone(true));
									callback(isSuccess);
								};
							} else if (c_oAscLockTypeElemSubType.InsertRows === subType) {
								newCallback = function (isSuccess) {
									if (isSuccess)
										t.collaborativeEditing.addRowsRange(sheetId, range.clone(true));
									callback(isSuccess);
								};
							} else if (c_oAscLockTypeElemSubType.DeleteColumns === subType) {
								newCallback = function (isSuccess) {
									if (isSuccess) {
										t.collaborativeEditing.removeColsRange(sheetId, range.clone(true));
										t.collaborativeEditing.removeCols(sheetId, range.c1, range.c2 - range.c1 + 1);
									}
									callback(isSuccess);
								};
							} else if (c_oAscLockTypeElemSubType.DeleteRows === subType) {
								newCallback = function (isSuccess) {
									if (isSuccess) {
										t.collaborativeEditing.removeRowsRange(sheetId, range.clone(true));
										t.collaborativeEditing.removeRows(sheetId, range.r1, range.r2 - range.r1 + 1);
									}
									callback(isSuccess);
								};
							}
							this.collaborativeEditing.addCheckLock(lockInfo);
						}
					} else {
						if (c_oAscLockTypeElemSubType.InsertColumns === subType) {
							t.collaborativeEditing.addColsRange(sheetId, range.clone(true));
						} else if (c_oAscLockTypeElemSubType.InsertRows === subType) {
							t.collaborativeEditing.addRowsRange(sheetId, range.clone(true));
						} else if (c_oAscLockTypeElemSubType.DeleteColumns === subType) {
							t.collaborativeEditing.removeColsRange(sheetId, range.clone(true));
							t.collaborativeEditing.removeCols(sheetId, range.c1, range.c2 - range.c1 + 1);
						} else if (c_oAscLockTypeElemSubType.DeleteRows === subType) {
							t.collaborativeEditing.removeRowsRange(sheetId, range.clone(true));
							t.collaborativeEditing.removeRows(sheetId, range.r1, range.r2 - range.r1 + 1);
						}
					}
				}

				if (false === this.collaborativeEditing.getCollaborativeEditing()) {
					// Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
					newCallback(true);
					newCallback = undefined;
				}
				this.collaborativeEditing.onEndCheckLock(newCallback);
				return true;
			},

			changeWorksheet: function (prop, val) {
				// Проверка глобального лока
				if (this.collaborativeEditing.getGlobalLock())
					return;

				var t = this;
				var arn = t.activeRange.clone(true);
				var range;
				var fullRecalc = undefined;
				var pad, cw;
				var isUpdateCols = false, isUpdateRows = false;
				var cleanCacheCols = false, cleanCacheRows = false;
				var _updateRangeIns, _updateRangeDel, bUndoRedo;
				var functionModelAction = null;
				var lockDraw = false;	// Параметр, при котором не будет отрисовки (т.к. мы просто обновляем информацию на неактивном листе)

				var onChangeWorksheetCallback = function (isSuccess) {
					if (false === isSuccess)
						return;

					if ($.isFunction(functionModelAction)) {functionModelAction();}

					t._initCellsArea(fullRecalc);
					if (fullRecalc) {
						t.cache.reset();
					} else {
						if (cleanCacheCols) { t._cleanCache(asc_Range(arn.c1, 0, arn.c2, t.rows.length - 1)); }
						if (cleanCacheRows) { t._cleanCache(asc_Range(0, arn.r1, t.cols.length - 1, arn.r2)); }
					}
					t._cleanCellsTextMetricsCache();
					t._prepareCellTextMetricsCache(t.visibleRange);
					t.draw();

					t._trigger("reinitializeScroll");

					if (isUpdateCols) { t._updateVisibleColsCount(); }
					if (isUpdateRows) { t._updateVisibleRowsCount(); }

					t.objectRender.showDrawingObjects(true, null, true);
				};

				switch (prop) {

					case "colWidth":
						functionModelAction = function () {
							pad = t.width_padding * 2 + t.width_1px;
							cw = t._charCountToModelColWidth(val, true);
							t.model.setColWidth(cw, arn.c1, arn.c2);
							isUpdateCols = true;
							fullRecalc = true;
						};
						return this._isLockedAll (onChangeWorksheetCallback);

					case "insColBefore":
						functionModelAction = function () {
							fullRecalc = true;
							var ar = t.activeRange.clone(true);
							t.autoFilters.insertColumn(t, prop, val, ar);
							t.model.insertColsBefore(arn.c1, val);
						};
						return this._isLockedCells (new asc_Range(arn.c1, 0, arn.c1 + val - 1, gc_nMaxRow0), c_oAscLockTypeElemSubType.InsertColumns, onChangeWorksheetCallback);
					case "insColAfter":
						functionModelAction = function () {
							fullRecalc = true;
							var ar = t.activeRange.clone(true);
							t.autoFilters.insertColumn(t, prop, val, ar);
							t.model.insertColsAfter(arn.c2, val);
						};
						return this._isLockedCells (new asc_Range(arn.c2, 0, arn.c2 + val - 1, gc_nMaxRow0), c_oAscLockTypeElemSubType.InsertColumns, onChangeWorksheetCallback);
					case "delCol":
						functionModelAction = function () {
							fullRecalc = true;
							t.model.removeCols(arn.c1, arn.c2);
						};
						return this._isLockedCells (new asc_Range(arn.c1, 0, arn.c2, gc_nMaxRow0), c_oAscLockTypeElemSubType.DeleteColumns, onChangeWorksheetCallback);
					case "showCols":
						functionModelAction = function () {
							t.model.setColHidden(/*bHidden*/false, arn.c1, arn.c2);
							fullRecalc = true;
						};
						return this._isLockedAll (onChangeWorksheetCallback);
					case "hideCols":
						functionModelAction = function () {
							t.model.setColHidden(/*bHidden*/true, arn.c1, arn.c2);
							fullRecalc = true;
						};
						return this._isLockedAll (onChangeWorksheetCallback);

					case "rowHeight":
						functionModelAction = function () {
							t.model.setRowHeight(Math.min(val + t.height_1px, t.maxRowHeight), arn.r1, arn.r2);
							isUpdateRows = true;
							fullRecalc = true;
						};
						return this._isLockedAll (onChangeWorksheetCallback);
					case "insRowBefore":
						functionModelAction = function () {
							fullRecalc = true;
							t.model.insertRowsBefore(arn.r1, val);
						};
						return this._isLockedCells (new asc_Range(0, arn.r1, gc_nMaxCol0, arn.r1 + val - 1), c_oAscLockTypeElemSubType.InsertRows, onChangeWorksheetCallback);
					case "insRowAfter":
						functionModelAction = function () {
							fullRecalc = true;
							t.model.insertRowsAfter(arn.r2, val);
						};
						return this._isLockedCells (new asc_Range(0, arn.r2, gc_nMaxCol0, arn.r2 + val - 1), c_oAscLockTypeElemSubType.InsertRows, onChangeWorksheetCallback);
					case "delRow":
						functionModelAction = function () {
							fullRecalc = true;
							t.model.removeRows(arn.r1, arn.r2);
						};
						return this._isLockedCells (new asc_Range(0, arn.r1, gc_nMaxCol0, arn.r1), c_oAscLockTypeElemSubType.DeleteRows, onChangeWorksheetCallback);
					case "showRows":
						functionModelAction = function () {
							t.model.setRowHidden(/*bHidden*/false, arn.r1, arn.r2);
							fullRecalc = true;
						};
						return this._isLockedAll (onChangeWorksheetCallback);
					case "hideRows":
						functionModelAction = function () {
							t.model.setRowHidden(/*bHidden*/true, arn.r1, arn.r2);
							fullRecalc = true;
						};
						return this._isLockedAll (onChangeWorksheetCallback);

					case "insCell":
						bUndoRedo = val.range != undefined;
						if (val && val.range) {
							_updateRangeIns = val.range;
							val = val.val;
						} else {
							_updateRangeIns = arn;
						}
						range = t.model.getRange3(_updateRangeIns.r1, _updateRangeIns.c1, _updateRangeIns.r2, _updateRangeIns.c2);
						switch (val) {
							case c_oAscInsertOptions.InsertCellsAndShiftRight:
								functionModelAction = function () {
									t.model.onStartTriggerAction();
									if (range.addCellsShiftRight()) {
										fullRecalc = true;
										t.cellCommentator.updateCommentsDependencies(true, val, _updateRangeIns);
									}
									t.model.onEndTriggerAction();
								};

								if(bUndoRedo)
									onChangeWorksheetCallback(true);
								else
									this._isLockedCells (new asc_Range(_updateRangeIns.c1, _updateRangeIns.r1,
										gc_nMaxCol0, _updateRangeIns.r2), null, onChangeWorksheetCallback);
								return;
							case c_oAscInsertOptions.InsertCellsAndShiftDown:
								functionModelAction = function () {
									t.model.onStartTriggerAction();
									if (range.addCellsShiftBottom()) {
										fullRecalc = true;
										t.cellCommentator.updateCommentsDependencies(true, val, _updateRangeIns);
									}
									t.model.onEndTriggerAction();
								};

								if(bUndoRedo)
									onChangeWorksheetCallback(true);
								else
									this._isLockedCells (new asc_Range(_updateRangeIns.c1, _updateRangeIns.r1,
										_updateRangeIns.c2, gc_nMaxRow0), null, onChangeWorksheetCallback);
								return;
							case c_oAscInsertOptions.InsertColumns:
								functionModelAction = function () {
									fullRecalc = true;
									t.model.onStartTriggerAction();
									t.model.insertColsBefore(_updateRangeIns.c1, _updateRangeIns.c2 - _updateRangeIns.c1 + 1);
									t.model.onEndTriggerAction();
									var ar = t.activeRange.clone(true);
									t.autoFilters.insertColumn(t, prop, _updateRangeIns, ar);
									
									if ( !bUndoRedo ) {
										t.objectRender.updateDrawingObject(true, val, _updateRangeIns);
									}
									t.cellCommentator.updateCommentsDependencies(true, val, _updateRangeIns);
								};
								if(bUndoRedo)
									onChangeWorksheetCallback(true);
								else
									this._isLockedCells (new asc_Range(_updateRangeIns.c1, 0, _updateRangeIns.c2,
										gc_nMaxRow0), c_oAscLockTypeElemSubType.InsertColumns,
										onChangeWorksheetCallback);
								return;
							case c_oAscInsertOptions.InsertRows:
								functionModelAction = function () {
									fullRecalc = true;
									t.model.onStartTriggerAction();
									t.model.insertRowsBefore(_updateRangeIns.r1, _updateRangeIns.r2 - _updateRangeIns.r1 + 1);
									t.model.onEndTriggerAction();
									var ar = t.activeRange.clone(true);
									t.autoFilters.insertRows(t, prop,_updateRangeIns, ar);
									
									if ( !bUndoRedo ) {
										t.objectRender.updateDrawingObject(true, val, _updateRangeIns);
									}
									t.cellCommentator.updateCommentsDependencies(true, val, _updateRangeIns);
								};
								if(bUndoRedo)
									onChangeWorksheetCallback(true);
								else
									this._isLockedCells (new asc_Range(0, _updateRangeIns.r1, gc_nMaxCol0,
										_updateRangeIns.r2), c_oAscLockTypeElemSubType.InsertRows,
										onChangeWorksheetCallback);
								return;
							default: return;
						}
						break;

					case "delCell":
						bUndoRedo = val.range != undefined;
						if (val && val.range) {
							_updateRangeDel = val.range;
							val = val.val;
						} else {
							_updateRangeDel = arn;
						}
						range = t.model.getRange3(_updateRangeDel.r1, _updateRangeDel.c1, _updateRangeDel.r2, _updateRangeDel.c2);
						switch (val) {
							case c_oAscDeleteOptions.DeleteCellsAndShiftLeft:
								functionModelAction = function () {
									if (range.deleteCellsShiftLeft()) {
										fullRecalc = true;
										t.cellCommentator.updateCommentsDependencies(false, val, _updateRangeDel);
									}
								};

								if(bUndoRedo)
									onChangeWorksheetCallback(true);
								else
									this._isLockedCells (new asc_Range(_updateRangeDel.c1, _updateRangeDel.r1,
										gc_nMaxCol0, _updateRangeDel.r2), null, onChangeWorksheetCallback);
								return;
							case c_oAscDeleteOptions.DeleteCellsAndShiftTop:
								functionModelAction = function () {
									if (range.deleteCellsShiftUp()) {
										fullRecalc = true;
										t.cellCommentator.updateCommentsDependencies(false, val, _updateRangeDel);
									}
								};

								if(bUndoRedo)
									onChangeWorksheetCallback(true);
								else
									this._isLockedCells (new asc_Range(_updateRangeDel.c1, _updateRangeDel.r1,
										_updateRangeDel.c2, gc_nMaxRow0), null, onChangeWorksheetCallback);
								return;
							case c_oAscDeleteOptions.DeleteColumns:
								functionModelAction = function () {
									fullRecalc = true;
									t.model.removeCols(_updateRangeDel.c1, _updateRangeDel.c2);
									var ar = t.activeRange.clone(true);
									t.autoFilters.insertColumn(t, prop,_updateRangeDel, ar);
									if (!bUndoRedo) {
										t.objectRender.updateDrawingObject(false, val, _updateRangeDel);
									}
									t.cellCommentator.updateCommentsDependencies(false, val, _updateRangeDel);
								};
								if(bUndoRedo)
									onChangeWorksheetCallback(true);
								else
									this._isLockedCells (new asc_Range(_updateRangeDel.c1, 0, _updateRangeDel.c2,
										gc_nMaxRow0), c_oAscLockTypeElemSubType.DeleteColumns,
										onChangeWorksheetCallback);
								return;
							case c_oAscDeleteOptions.DeleteRows:
								functionModelAction = function () {
									fullRecalc = true;
									t.model.removeRows(_updateRangeDel.r1, _updateRangeDel.r2);
									var ar = t.activeRange.clone(true);
									t.autoFilters.insertRows(t, prop,_updateRangeDel, ar);
									if (!bUndoRedo) {
										t.objectRender.updateDrawingObject(false, val, _updateRangeDel);
									}
									t.cellCommentator.updateCommentsDependencies(false, val, _updateRangeDel);
								};
								if(bUndoRedo)
									onChangeWorksheetCallback(true);
								else
									this._isLockedCells (new asc_Range(0, _updateRangeDel.r1, gc_nMaxCol0,
										_updateRangeDel.r2), c_oAscLockTypeElemSubType.DeleteRows,
										onChangeWorksheetCallback);
								return;
							default: return;
						}
						break;

					case "sheetViewSettings":
						functionModelAction = function () {
							t.model.setSheetViewSettings(val);

							isUpdateCols = true;
							isUpdateRows = true;
							fullRecalc = true;
						};

						return this._isLockedAll (onChangeWorksheetCallback);

					case "update":
						if (val !== undefined) {
							fullRecalc = !!val.fullRecalc;
							lockDraw = true === val.lockDraw;
						}
						break;

					case "updateRange":
						if (val && val.range) {
							t._updateCellsRange(val.range, val.canChangeColWidth, val.isLockDraw);
						}
						return;

					default: return;
				}

				t._initCellsArea(fullRecalc);
				if (fullRecalc) {
					t.cache.reset();
				} else {
					if (cleanCacheCols) { t._cleanCache(asc_Range(arn.c1, 0, arn.c2, t.rows.length - 1)); }
					if (cleanCacheRows) { t._cleanCache(asc_Range(0, arn.r1, t.cols.length - 1, arn.r2)); }
				}
				t._cleanCellsTextMetricsCache();
				t._prepareCellTextMetricsCache(t.visibleRange);
				t.draw(lockDraw);

				t._trigger("reinitializeScroll");

				if (isUpdateCols) { t._updateVisibleColsCount(); }
				if (isUpdateRows) { t._updateVisibleRowsCount(); }

				if (false === lockDraw) {
					t.objectRender.showDrawingObjects(true, null, true);
					t.autoFilters.drawAutoF(t);
				}
			},

			expandColsOnScroll: function (isNotActive, updateColsCount, newColsCount) {
				var t = this;
				var arn;
				var bIsMaxCols = false;
				var obr = this.objectRender.getDrawingAreaMetrics() || {maxCol: 0, maxRow: 0};
				var maxc = Math.max(this.model.getColsCount(), this.cols.length, obr.maxCol);
				if (newColsCount) {
					maxc = Math.max(maxc, newColsCount);
				}

				// Сохраняем старое значение
				var nLastCols = this.nColsCount;
				if(isNotActive){
					this.nColsCount = maxc + 1;
				} else if (updateColsCount) {
					this.nColsCount = maxc;
					if (this.cols.length < this.nColsCount)
						nLastCols = this.cols.length;
				} else {
					arn = t.activeRange.clone(true);
					if (arn.c2 >= t.cols.length - 1) {
						this.nColsCount = maxc;
						if(arn.c2 >= this.nColsCount - 1)
							this.nColsCount = arn.c2 + 2;
					}
				}
				// Проверяем ограничения по столбцам
				if (gc_nMaxCol < this.nColsCount) {
					this.nColsCount = gc_nMaxCol;
					bIsMaxCols = true;
				}

				// Проверяем замерженность всего или какой-либо строки
				this._updateMergedCellsRange(asc_Range (nLastCols, 0, this.nColsCount - 1, this.nRowsCount));

				t._calcColumnWidths(/*fullRecalc*/2);
				return (nLastCols !== this.nColsCount || bIsMaxCols);
			},

			expandRowsOnScroll: function (isNotActive, updateRowsCount, newRowsCount) {
				var t = this;
				var arn;
				var bIsMaxRows = false;
				var obr = this.objectRender.getDrawingAreaMetrics() || {maxCol: 0, maxRow: 0};
				var maxr = Math.max(this.model.getRowsCount() , this.rows.length, obr.maxRow);
				if (newRowsCount) {
					maxr = Math.max(maxr, newRowsCount);
				}

				// Сохраняем старое значение
				var nLastRows = this.nRowsCount;
				if(isNotActive){
					this.nRowsCount = maxr + 1;
				} else if (updateRowsCount) {
					this.nRowsCount = maxr;
					if (this.rows.length < this.nRowsCount)
						nLastRows = this.rows.length;
				} else {
					arn = t.activeRange.clone(true);
					if (arn.r2 >= t.rows.length - 1) {
						this.nRowsCount = maxr;
						if(arn.r2 >= this.nRowsCount - 1)
							this.nRowsCount = arn.r2 + 2;
					}
				}
				// Проверяем ограничения по строкам
				if (gc_nMaxRow < this.nRowsCount) {
					this.nRowsCount = gc_nMaxRow;
					bIsMaxRows = true;
				}

				// Проверяем замерженность всего или какого-либо столбца
				this._updateMergedCellsRange(asc_Range (0, nLastRows, this.nColsCount, this.nRowsCount - 1));

				t._calcRowHeights(/*fullRecalc*/2);
				return (nLastRows !== this.nRowsCount || bIsMaxRows);
			},

			optimizeColWidth: function (col) {
				var t = this;

				var onChangeWidthCallback = function (isSuccess) {
					if (false === isSuccess)
						return;

					var width = null;
					var row, ct, c, fl, str, maxW, tm, range;
					var filterButton = null;

					for (row = 0; row < t.rows.length; ++row) {
						ct = t._getCellTextCache(col, row);
						if (ct === undefined) {continue;}
						if (ct.flags.isMerged) {
							range = t._getMergedCellsRange(col, row);
							if (range === undefined) { // got uncached merged cells, redirect it
								range = t._fetchMergedCellsRange(col, row);
							}
							// Для замерженных ячеек (с 2-мя или более колонками) оптимизировать не нужно
							if (range.c1 !== range.c2)
								continue;
						}

						// пересчет метрик текста
						t.cols[col].isCustomWidth = false;
						t._addCellTextToCache(col, row, /*canChangeColWidth*/c_oAscCanChangeColWidth.all);
						ct = t._getCellTextCache(col, row);

						if (ct.metrics.height > t.maxRowHeight) {
							// вычисление новой ширины столбца, чтобы высота текста была меньше maxRowHeight
							c = t._getCell(col, row);
							fl = t._getCellFlags(c);
							if (fl.isMerged) {continue;}
							str = c.getValue2();
							maxW = ct.metrics.width + t.maxDigitWidth;
							while (1) {
								tm = t._roundTextMetrics( t.stringRender.measureString(str, fl, maxW) );
								if (tm.height <= t.maxRowHeight) {break;}
								maxW += t.maxDigitWidth;
							}
							width = Math.max(width, tm.width);
						} else {
							filterButton = t.autoFilters.getSizeButton(t, {c1: col, r1: row});
							if (null !== filterButton && CellValueType.String === ct.cellType)
								width = Math.max(width, ct.metrics.width + filterButton.width);
							else
								width = Math.max(width, ct.metrics.width);
						}
					}

					if (width > 0) {
						var pad = t.width_padding * 2 + t.width_1px;
						var cc = Math.min(t._colWidthToCharCount(width + pad), /*max col width*/255);
						var cw = t._charCountToModelColWidth(cc, true);
					} else {
						cw = gc_dDefaultColWidthCharsAttribute;
					}

					History.Create_NewPoint();
					History.SetSelection(null, true);
					History.StartTransaction();
					t.model.setColWidth(cw, col, col);
					// Выставляем, что это bestFit
					t.model.setColBestFit(true, col, col);
					History.EndTransaction();

					t.nColsCount = 0;
					t._calcColumnWidths(/*fullRecalc*/0);
					t._updateVisibleColsCount();
					t._cleanCache(asc_Range(col, 0, col, t.rows.length - 1));
					t.changeWorksheet("update");
				};
				return this._isLockedAll (onChangeWidthCallback);
			},

			optimizeRowHeight: function (row) {
				var t = this;

				var onChangeHeightCallback = function (isSuccess) {
					if (false === isSuccess)
						return;

					var height = t.defaultRowHeight;
					var col, ct;

					for (col = 0; col < t.rows.length; ++col) {
						ct = t._getCellTextCache(col, row);
						if (ct === undefined) {continue;}
						if (ct.flags.isMerged) {
							range = t._getMergedCellsRange(col, row);
							if (range === undefined) { // got uncached merged cells, redirect it
								range = t._fetchMergedCellsRange(col, row);
							}
							// Для замерженных ячеек (с 2-мя или более строками) оптимизировать не нужно
							if (range.r1 !== range.r2)
								continue;
						}

						height = Math.max(height, ct.metrics.height);
					}

					History.Create_NewPoint();
					History.SetSelection(null, true);
					History.StartTransaction();
					t.model.setRowHeight(Math.min(height + t.height_1px, t.maxRowHeight), row, row);
					// Выставляем, что это bestFit
					t.model.setRowBestFit (true, row, row);
					History.EndTransaction();

					t.nRowsCount = 0;
					t._calcRowHeights(/*fullRecalc*/0);
					t._updateVisibleRowsCount();
					t._cleanCache(asc_Range(0, row, t.cols.length - 1, row));
					t.changeWorksheet("update");
				};
				return this._isLockedAll (onChangeHeightCallback);
			},


			// ----- Search -----

			_setActiveCell: function (col, row) {
				var ar = this.activeRange, sc = ar.startCol, sr = ar.startRow, offs;

				this.cleanSelection();

				ar.assign(col, row, col, row);
				ar.type = c_oAscSelectionType.RangeCells;
				ar.startCol = col;
				ar.startRow = row;

				this._fixSelectionOfMergedCells();
				this._fixSelectionOfHiddenCells();
				this._drawSelection();

				offs = this._calcActiveRangeOffset();
				if (sc !== ar.startCol || sr !== ar.startRow) {
					this._trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/false));
					this._trigger("selectionChanged", this.getSelectionInfo());
				}
				return offs;
			},

			findCellText: function (text, scanByRows, scanForward) {
				var self = this;
				// ToDo не учитываем регистр
				text = text.toLowerCase();
				var ar = this.activeRange;
				var c = ar.startCol;
				var r = ar.startRow;
				var minC = 0;
				var minR = 0;
				var maxC = this.cols.length - 1;
				var maxR = this.rows.length - 1;
				var inc = scanForward ? +1 : -1;
				var ct, mc, excluded = [];
				var _tmpCell, lowerChars;

				function isExcluded(col, row) {
					for (var i = 0; i < excluded.length; ++i) {
						if (excluded[i].contains(col, row)) {return true;}
					}
					return false;
				}

				function findNextCell() {
					var ct = undefined;
					do {
						do {
							mc = self._getMergedCellsRange(c, r);
							if (mc) {excluded.push(mc);}
							if (scanByRows) {
								c += mc ? (scanForward ? mc.c2 + 1 - c : mc.c1 - 1 - c) : inc;
								if (c < minC || c > maxC) {c = scanForward ? minC : maxC; r += inc;}
							} else {
								r += mc ? (scanForward ? mc.r2 + 1 - r : mc.r1 - 1 - r) : inc;
								if (r < minR || r > maxR) {r = scanForward ? minR : maxR; c += inc;}
							}
							if (c < minC || c > maxC || r < minR || r > maxR) {return undefined;}
						} while ( isExcluded(c, r) );
						ct = self._getCellTextCache(c, r);
					} while (!ct);
					return ct;
				}

				for (ct = findNextCell(); ct; ct = findNextCell()) {
					// Не пользуемся RegExp, чтобы не возиться со спец.символами
					// ToDo не учитываем регистр

					mc = this._getMergedCellsRange(c, r);
					if (mc)
						_tmpCell = this.model.getCell (new CellAddress(mc.r1, mc.c1, 0));
					else
						_tmpCell = this.model.getCell (new CellAddress(r, c, 0));
					lowerChars = _tmpCell.getValueForEdit().toLowerCase();
					if (lowerChars.indexOf(text) >= 0) {
						return this._setActiveCell(c, r);
					}
				}

				// Сбрасываем замерженные
				excluded = [];
				// Продолжаем циклический поиск
				if (scanForward){
					// Идем вперед с первой ячейки
					minC = 0;
					minR = 0;
					if (scanByRows) {
						c = -1;
						r = 0;

						maxC = this.cols.length - 1;
						maxR = ar.startRow;
					}
					else {
						c = 0;
						r = -1;

						maxC = ar.startCol;
						maxR = this.rows.length - 1;
					}
				}
				else {
					// Идем назад с последней
					c = this.cols.length - 1;
					r = this.rows.length - 1;
					if (scanByRows) {
						minC = 0;
						minR = ar.startRow;
					}
					else {
						minC = ar.startCol;
						minR = 0;
					}
					maxC = this.cols.length - 1;
					maxR = this.rows.length - 1;
				}
				for (ct = findNextCell(); ct; ct = findNextCell()) {
					// Не пользуемся RegExp, чтобы не возиться со спец.символами
					// ToDo не учитываем регистр
					mc = this._getMergedCellsRange(c, r);
					if (mc)
						_tmpCell = this.model.getCell (new CellAddress(mc.r1, mc.c1, 0));
					else
						_tmpCell = this.model.getCell (new CellAddress(r, c, 0));
					lowerChars = _tmpCell.getValueForEdit().toLowerCase();
					if (lowerChars.indexOf(text) >= 0) {
						return this._setActiveCell(c, r);
					}
				}
				return undefined;
			},

			findCell: function(reference) {
				var t = this;
				var match = (/(?:R(\d+)C(\d+)|([A-Z]+[0-9]+))(?::(?:R(\d+)C(\d+)|([A-Z]+[0-9]+)))?/i).exec(reference);
				if (!match) {return null;}

				function _findCell(match1, match2, match3) {
					var addr = typeof match1 === "string" ?
							new CellAddress(parseInt(match1), parseInt(match2)) :
							typeof match3 === "string" ? new CellAddress(match3) : null;
					if (addr && addr.isValid() && addr.getRow0() >= t.rows.length) {
						t.nRowsCount = addr.getRow0() + 1;
						t._calcRowHeights(/*fullRecalc*/2);
					}
					if (addr && addr.isValid() && addr.getCol0() >= t.cols.length) {
						t.nColsCount = addr.getCol0() + 1;
						t._calcColumnWidths(/*fullRecalc*/2);
					}
					return addr && addr.isValid() ? addr : null;
				}

				var addr1 = _findCell(match[1], match[2], match[3]);
				var addr2 = _findCell(match[4], match[5], match[6]);
				if (!addr1 && !addr2) {
					return {};
				}
				var delta = t._setActiveCell(addr1.getCol0(), addr1.getRow0());
				return !addr2 ? delta :
						t.changeSelectionEndPoint(addr2.getCol0() - addr1.getCol0(), addr2.getRow0() - addr1.getRow0(),
						/*isCoord*/false, /*isSelectMode*/false);
			},


			// ----- Cell Editor -----

			setCellEditMode: function (isCellEditMode) {
				this.isCellEditMode = isCellEditMode;
			},

			setFormulaEditMode: function (isFormulaEditMode) {
				this.isFormulaEditMode = isFormulaEditMode;
			},

			getFormulaEditMode: function () {
				return this.isFormulaEditMode;
			},

			setSelectDialogRangeMode: function (isSelectDialogRangeMode) {
				if (isSelectDialogRangeMode === this.isSelectDialogRangeMode)
					return;
				this.isSelectDialogRangeMode = isSelectDialogRangeMode;
				this.cleanSelection();

				if (false === this.isSelectDialogRangeMode) {
					if (null !== this.copyOfActiveRange) {
						this.activeRange = this.copyOfActiveRange.clone(true);
						this.activeRange.startCol = this.copyOfActiveRange.startCol;
						this.activeRange.startRow = this.copyOfActiveRange.startRow;
					}
					this.copyOfActiveRange = null;
				} else {
					this.copyOfActiveRange = this.activeRange.clone(true);
					this.copyOfActiveRange.startCol = this.activeRange.startCol;
					this.copyOfActiveRange.startRow = this.activeRange.startRow;
				}

				this._drawSelection();
			},

			// Получаем свойство: редактируем мы сейчас или нет
			getCellEditMode: function () {
				return this.isCellEditMode;
			},

			_isFormula: function (val) {
				return val.length > 0 && val[0].text.length > 1 && val[0].text.charAt(0) === "=" ? true : false;
			},

			getActiveCellLock: function (x, y, isCoord) {
				var t = this;
				var col, row;
				if (isCoord) {
					x *= asc_getcvt( 0/*px*/, 1/*pt*/, t._getPPIX() );
					y *= asc_getcvt( 0/*px*/, 1/*pt*/, t._getPPIY() );
					col = t._findColUnderCursor(x, true);
					row = t._findRowUnderCursor(y, true);
					if (!col || !row) {return false;}
					col = col.col;
					row = row.row;
				} else {
					//col = this.model._getCol(t.activeRange.startCol).getId();
					//row = this.model._getRow(t.activeRange.startRow).getId();

					col = t.activeRange.startCol;
					row = t.activeRange.startRow;
				}

				// Проверим замерженность
				var mergedRange = this._getMergedCellsRange(col, row);
				return mergedRange ? mergedRange : asc_Range(col, row, col, row);
			},

			openCellEditor: function (editor, x, y, isCoord, fragments, cursorPos, isFocus, isClearCell,
									  isHideCursor, activeRange) {
				var t = this, vr = t.visibleRange, tc = t.cols, tr = t.rows, col, row, c, fl, mc, bg;
				var ar = t.activeRange;
				if (activeRange) {
					t.activeRange.c1 = activeRange.c1;
					t.activeRange.c2 = activeRange.c2;
					t.activeRange.r1 = activeRange.r1;
					t.activeRange.r2 = activeRange.r2;
					t.activeRange.startCol = activeRange.startCol;
					t.activeRange.startRow = activeRange.startRow;
					t.activeRange.type = activeRange.type;
				}

				if (t.objectRender.inSelectionDrawingObjectIndex(x, y) >= 0)
					return false;

				function getLeftSide(col) {
					var i, res = [], offs = t.cols[vr.c1].left - t.cols[0].left;
					for (i = col; i >= vr.c1; --i) {
						res.push(t.cols[i].left - offs);
					}
					return res;
				}

				function getRightSide(col) {
					var i, w, res = [], offs = t.cols[vr.c1].left - t.cols[0].left;

					// Для замерженных ячеек, можем уйти за границу
					if (fl.isMerged && col > vr.c2)
						col = vr.c2;

					for (i = col; i <= vr.c2; ++i) {
						res.push(t.cols[i].left + t.cols[i].width - offs);
					}
					w = t.drawingCtx.getWidth();
					if (res[res.length - 1] > w) {
						res[res.length - 1] = w;
					}
					return res;
				}

				function getBottomSide(row) {
					var i, h, res = [], offs = t.rows[vr.r1].top - t.rows[0].top;

					// Для замерженных ячеек, можем уйти за границу
					if (fl.isMerged && row > vr.r2)
						row = vr.r2;

					for (i = row; i <= vr.r2; ++i) {
						res.push(t.rows[i].top + t.rows[i].height - offs);
					}
					h = t.drawingCtx.getHeight();
					if (res[res.length - 1] > h) {
						res[res.length - 1] = h;
					}
					return res;
				}

				if (isCoord) {
					x *= asc_getcvt( 0/*px*/, 1/*pt*/, t._getPPIX() );
					y *= asc_getcvt( 0/*px*/, 1/*pt*/, t._getPPIY() );
					col = t._findColUnderCursor(x, true);
					row = t._findRowUnderCursor(y, true);
					if (!col || !row) {return false;}
					col = col.col;
					row = row.row;
				} else {
					col = ar.startCol;
					row = ar.startRow;
				}

				c = t._getVisibleCell(col, row);
				if (!c) {throw "Can not get cell data (col=" + col + ", row=" + row + ")";}

				fl = t._getCellFlags(c);
				if (fl.isMerged) {
					mc = t._getMergedCellsRange(col, row);
					c = t._getVisibleCell(mc.c1, mc.r1);
					if (!c) {throw "Can not get merged cell data (col=" + mc.c1 + ", row=" + mc.r1 + ")";}
					fl = t._getCellFlags(c);

					// Первую ячейку нужно сделать видимой
					var bIsUpdateX = false;
					var bIsUpdateY = false;
					if (mc.c1 < vr.c1) {
						vr.c1 = mc.c1;
						bIsUpdateX = true;
						t._calcVisibleColumns();
					}
					if (mc.r1 < vr.r1) {
						vr.r1 = mc.r1;
						bIsUpdateY = true;
						t._calcVisibleRows();
					}
					if (bIsUpdateX && bIsUpdateY) {
						this._trigger("reinitializeScroll");
					}
					else if (bIsUpdateX) {
						this._trigger("reinitializeScrollX");
					}
					else if (bIsUpdateY) {
						this._trigger("reinitializeScrollY");
					}

					if (bIsUpdateX || bIsUpdateY) {
						t.draw();
					}
				}

				bg = c.getFill();
				if(null != bg)
					bg = bg.getRgb();

				t.isFormulaEditMode = false;
				// Очищаем массив ячеек для текущей формулы
				t.arrActiveFormulaRanges = [];
				
				var oFontColor = c.getFontcolor();
				if(null != oFontColor)
					oFontColor = oFontColor.getRgb();
				editor.open({
					cellX: t.cellsLeft + tc[!fl.isMerged ? col : mc.c1].left - tc[vr.c1].left,
					cellY: t.cellsTop + tr[!fl.isMerged ? row : mc.r1].top - tr[vr.r1].top,
					leftSide: getLeftSide(!fl.isMerged ? col : mc.c1),
					rightSide: getRightSide(!fl.isMerged ? col : mc.c2),
					bottomSide: getBottomSide(!fl.isMerged ? row : mc.r2),
					fragments: fragments !== undefined ? fragments : c.getValueForEdit2(),
					flags: fl,
					font: new asc_FP(c.getFontname(), c.getFontsize()),
					background: bg !== null ? asc_n2css(bg) : t.settings.cells.defaultState.background,
					hasBackground: bg !== null,
					textColor: oFontColor || t.settings.cells.defaultState.color,
					cursorPos: cursorPos,
					zoom: t.getZoom(),
					focus: isFocus,
					isClearCell: isClearCell,
					isHideCursor: isHideCursor,
					saveValueCallback: function (val, flags, skipNLCheck) {
						var oldMode = t.isFormulaEditMode;
						var oCellEdit = new asc_Range(col, row, col, row);
						t.isFormulaEditMode = false;

						t.model.onStartTriggerAction();
						History.Create_NewPoint();
						History.SetSelection(oCellEdit);
						History.StartTransaction();

						var isFormula = t._isFormula(val);

						if (isFormula) {
							var ftext = val.reduce(function (pv,cv) {return pv + cv.text;}, "");
							var ret = true;
							// ToDo - при вводе формулы в заголовок автофильтра надо писать "0"
							c.setValue(ftext, function(r){ ret = r;} );
							if(!ret) {
								t.isFormulaEditMode = oldMode;
								History.EndTransaction();
								t.model.onEndTriggerAction();
								return false;
							}
							isFormula = c.isFormula();
						} else {
							c.setValue2(val);
							// Вызываем функцию пересчета для заголовков форматированной таблицы
							t.autoFilters._renameTableColumn(t, oCellEdit);
						}

						if (!isFormula) {
							// Нужно ли выставлять WrapText (ищем символ новой строки в тексте)
							var bIsSetWrap = false;
							if (!skipNLCheck) {
								for (var key in val) {
									if (val[key].text.indexOf(kNewLine) >= 0) {
										bIsSetWrap = true;
										break;
									}
								}
							}
							if (bIsSetWrap)
								c.setWrap(true);

							var range = asc_Range(ar.startCol, ar.startRow, ar.startCol, ar.startRow);
							// Для формулы обновление будет в коде рассчета формулы
							t._updateCellsRange(range, /*canChangeColWidth*/c_oAscCanChangeColWidth.numbers);
						}
						History.EndTransaction();
						t.model.onEndTriggerAction();

						// если вернуть false, то редактор не закроется
						return true;
					}
				});
				// для отрисовки ранджей формулы
				t._drawSelection();
				return true;
			},

			openCellEditorWithText: function (editor, text, cursorPos, isFocus, activeRange) {
				var t = this;
				var ar = (activeRange) ? activeRange : t.activeRange;
				var c = t._getVisibleCell(ar.startCol, ar.startRow);
				var v, copyValue;

				if (!c) {throw "Can not get cell data (col=" +  ar.startCol + ", row=" +  ar.startCol + ")";}

				// get first fragment and change its text
				v = c.getValueForEdit2().slice(0, 1);
				// Создаем новый массив, т.к. getValueForEdit2 возвращает ссылку
				copyValue = [];
				copyValue[0] = {text: text, format: v[0].format.clone()};

				var bSuccess = t.openCellEditor(editor, 0, 0, /*isCoord*/false, /*fragments*/undefined, /*cursorPos*/undefined, isFocus, /*isClearCell*/true,
					/*isHideCursor*/false, activeRange);
				if (bSuccess) {
					editor.paste(copyValue, cursorPos);
				}
				return bSuccess;
			},

			_updateCellsRange: function (range, canChangeColWidth, lockDraw) {
				var t = this, r, c, h, d, ct;
				var mergedRange, bUpdateRowHeight;

				if (range === undefined) {range = t.activeRange.clone(true);}

				if(gc_nMaxCol0 === range.c2 || gc_nMaxRow0 === range.r2)
				{
					range = range.clone();
					if(gc_nMaxCol0 === range.c2)
						range.c2 = this.cols.length - 1;
					if(gc_nMaxRow0 === range.r2)
						range.r2 = this.rows.length - 1;
				}

				t._cleanCache(range);

				// Если размер диапазона превышает размер видимой области больше чем в 3 раза, то очищаем весь кэш
				if (t._isLargeRange(range)) {
					t.changeWorksheet("update", {lockDraw: lockDraw});
					return;
				}

				for (r = range.r1; r <= range.r2; ++r) {
					for (c = range.c1; c <= range.c2; ++c) {
						c = t._addCellTextToCache(c, r, canChangeColWidth); // may change member 'this.isChanged'
					}
					for (h = t.defaultRowHeight, d = t.defaultRowDescender, c = 0; c < t.cols.length; ++c) {
						ct = t._getCellTextCache(c, r, true);
						if (!ct) {continue;}
						// Замерженная ячейка (с 2-мя или более строками) не влияет на высоту строк!
						if (!ct.flags.isMerged) {
							bUpdateRowHeight = true;
						} else {
							mergedRange = t._getMergedCellsRange(c, r);
							if (undefined === mergedRange) { // got uncached merged cells, redirect it
								mergedRange = t._fetchMergedCellsRange(c, r);
							}
							// Для замерженных ячеек (с 2-мя или более строками) оптимизировать не нужно
							bUpdateRowHeight = mergedRange.r1 === mergedRange.r2;
						}
						if (bUpdateRowHeight)
							h = Math.max(h, ct.metrics.height);

						if (ct.cellVA !== kvaTop && ct.cellVA !== kvaCenter && !ct.flags.isMerged) {
							d = Math.max(d, ct.metrics.height - ct.metrics.baseline);
						}
					}
					if (Math.abs(h - t.rows[r].height) > 0.000001 && !t.rows[r].isCustomHeight) {
						t.rows[r].height = Math.min(h, t.maxRowHeight);
						if (!t.rows[r].isDefaultHeight) {
							t.model.setRowHeight(t.rows[r].height + this.height_1px, r, r);
						}
						t.isChanged = true;
					}
					if (Math.abs(d - t.rows[r].descender) > 0.000001) {
						t.rows[r].descender = d;
						t.isChanged = true;
					}
				}

				if (t.isChanged) {
					t.isChanged = false;
					t._initCellsArea(true);
					t.cache.reset();
					t._cleanCellsTextMetricsCache();
					t._prepareCellTextMetricsCache(t.visibleRange);
					t._trigger("reinitializeScroll");
					t._trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/false));
					t._trigger("selectionChanged", t.getSelectionInfo());
				}

				t.cellCommentator.updateCommentPosition();
				t.draw(lockDraw);
			},

			enterCellRange: function (editor) {
				var t = this;

				if (!t.isFormulaEditMode)
					return;

				var ar = t.arrActiveFormulaRanges[t.arrActiveFormulaRanges.length - 1];
				var s = t.getActiveRange(ar);

				editor.enterCellRange(s);

				return true;
			},

			changeCellRange: function(editor,range){
				var s = this.getActiveRange(range);
				if( range.isAbsolute ){
					var ra = range.isAbsolute.split(":"), _s;
					if( ra.length >= 1 ){
						var sa = s.split(":");
						for( var ind = 0; ind < sa.length; ind++ ){
							if( ra[ra.length>1?ind:0].indexOf("$") == 0 ){
								sa[ind] = "$"+sa[ind];
							}
							if( ra[ra.length>1?ind:0].lastIndexOf("$") != 0 ){
								for(var i = 0; i< sa[ind].length; i++){
									if(sa[ind].charAt(i).match(/[0-9]/gi)){
										_s = i;
										break;
									}
								}
								sa[ind] = sa[ind].substr(0,_s) + "$" +sa[ind].substr(_s,sa[ind].length);
							}
						}
						s = "";
						sa.forEach(function(e,i){ 
							s += (i!=0?":":"")
							s += e;
						})
					}
				}
				editor.changeCellRange(range,s);
				return true;
			},
			
			getActiveRange: function (ar) {
				if (ar.c1 === ar.c2 && ar.r1 === ar.r2) {return this._getCellTitle(ar.c1, ar.r1);}
				if (ar.c1 === ar.c2 && ar.r1 === 0 && ar.r2 === this.rows.length -1) {var ct = this._getColumnTitle(ar.c1); return ct + ":" + ct;}
				if (ar.r1 === ar.r2 && ar.c1 === 0 && ar.c2 === this.cols.length -1) {var rt = this._getRowTitle(ar.r1); return rt + ":" + rt;}
				if (ar.r1 === 0 && ar.r2 === gc_nMaxRow0 || ar.r1 === 1 && ar.r2 === gc_nMaxRow ){return this._getColumnTitle(ar.c1) + ":" + this._getColumnTitle(ar.c2);}
				if (ar.c1 === 0 && ar.c2 === gc_nMaxCol0 || ar.c1 === 1 && ar.c2 === gc_nMaxCol ){return this._getRowTitle(ar.r1) + ":" + this._getRowTitle(ar.r2);}
				return this._getCellTitle(ar.c1, ar.r1) + ":" + this._getCellTitle(ar.c2, ar.r2);
			},

			addFormulaRange: function (range) {
				var r = range !== undefined ? range : this.activeRange.clone(true);
				if (r.startCol === undefined || r.startRow === undefined) {
					r.startCol = r.c1;
					r.startRow = r.r1;
				}
				this.arrActiveFormulaRanges.push(r);
			},

			changeFormulaRange: function (range) {
				for (var i = 0; i < this.arrActiveFormulaRanges.length; ++i) {
					if (this.arrActiveFormulaRanges[i].isEqual(range)) {
						var r = this.arrActiveFormulaRanges[i];
						this.arrActiveFormulaRanges.splice(i, 1);
						this.arrActiveFormulaRanges.push(r);
						return;
					}
				}
			},

			cleanFormulaRanges: function () {
				// Очищаем массив ячеек для текущей формулы
				this.arrActiveFormulaRanges = [];
			},
			
			addAutoFilter: function (lTable, addFormatTableOptionsObj) {
				var t = this;
				var ar = t.activeRange.clone(true);
				var onChangeAutoFilterCallback = function (isSuccess) {
					if (false === isSuccess)
						return;
					
					return t.autoFilters.addAutoFilter(t, lTable, ar, undefined, false, addFormatTableOptionsObj);
				};
				this._isLockedAll (onChangeAutoFilterCallback);
			},
			
			applyAutoFilter: function (type, autoFilterObject) {
				var t = this;
				var ar = t.activeRange.clone(true);
				var onChangeAutoFilterCallback = function (isSuccess) {
					if (false === isSuccess)
						return;
					
					t.autoFilters.applyAutoFilter(type, autoFilterObject, ar, t);
				};
				this._isLockedAll (onChangeAutoFilterCallback);
			},
			
			sortColFilter: function (type,cellId) {
				var ar = this.activeRange.clone(true);
				this.autoFilters.sortColFilter(type, cellId, this, ar);
			},
			
			getAddFormatTableOptions: function(nameOption)
			{
				var ar = this.activeRange.clone(true);
				var t = this;
				var result = t.autoFilters.getAddFormatTableOptions(t, ar);
				return result;
			},

			_loadFonts: function (fontArr, callback) {
				var originFonts = [];
				var i, n, k = 0;
				for (i = 0; i < fontArr.length ;++i) {
					for (n = 0; n < fontArr[i].length; ++n) {
						if(-1 == $.inArray(fontArr[i][n], originFonts)) {
							originFonts[k] = fontArr[i][n];
							k++;
						}
					}
				}
				var api = window["Asc"]["editor"];
				api._loadFonts(originFonts, callback);
			}

		};


		/*
		 * Export
		 * -----------------------------------------------------------------------------
		 */
		window["Asc"].WorksheetView = WorksheetView;


	}
)(jQuery, window);
