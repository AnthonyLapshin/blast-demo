
import { _decorator, Component, view, screen, UITransform, Widget, sys, Sprite } from 'cc';
const { ccclass, property } = _decorator;

enum ResolutionWidget {
	fitWidth,
	firHeight
}

@ccclass('AdaptiveBg')
export default class AdaptiveBg extends Component {

	private originWidth: number;
	private originHeight: number;
	private originRatio: number;
	private widget: Widget;

	onLoad() {
		this.checkDevice();
	}

	checkDevice() {
		this.setWidgetStartSettings();
		this.saveOriginSizeInformation();
		this.setWidgetStartResolution();

		this.initListeners();
	}

	setWidgetStartSettings() {
		this.widget = this.node.getComponent(Widget);

		this.widget.left = 0;
		this.widget.right = 0;
		this.widget.top = 0;
		this.widget.bottom = 0;
	}

	saveOriginSizeInformation() {
		this.originWidth = this.node.getComponent(Sprite).spriteFrame.originalSize.width;
		this.originHeight = this.node.getComponent(Sprite).spriteFrame.originalSize.height;
		this.originRatio = this.originWidth / this.originHeight;
	}

	setWidgetStartResolution() {
		if (this.isViewportRatioMoreOriginBgRatio()) this.setWidgetAlign(ResolutionWidget.fitWidth);
		else this.setWidgetAlign(ResolutionWidget.firHeight);
	}

	initListeners() {
		screen.on('window-resize', this.onResize, this);
		screen.on('orientation-change', this.onResize, this);
		screen.on('orientation-change', this.onResize, this);
	}

	onResize() {
		this.setSize();
	}

	setWidgetAlign(resolution: ResolutionWidget) {
		if (resolution === ResolutionWidget.fitWidth) {
			this.widget.isAlignLeft = true;
			this.widget.isAlignRight = true;
			this.widget.isAlignBottom = false;
			this.widget.isAlignTop = false;
		} else if (resolution === ResolutionWidget.firHeight) {
			this.widget.isAlignLeft = false;
			this.widget.isAlignRight = false;
			this.widget.isAlignBottom = true;
			this.widget.isAlignTop = true;
		}
	}

	start() {
		this.setSize();
	}

	isViewportRatioMoreOriginBgRatio(): boolean {
		return view.getViewportRect().width / view.getViewportRect().height >= this.originRatio;
	}

	setSize() {
		if (this.isViewportRatioMoreOriginBgRatio()) {
			this.setWidgetAlign(ResolutionWidget.fitWidth);
			const curBgWidth = this.node.getComponent(UITransform).contentSize.width;
			const changeRatio = curBgWidth / this.originWidth;

			const newBgHeight = this.originHeight * changeRatio;

			this.node.getComponent(UITransform).setContentSize(curBgWidth, newBgHeight);
		} else {
			this.setWidgetAlign(ResolutionWidget.firHeight);

			const curBgHeight = this.node.getComponent(UITransform).contentSize.height;
			const changeRatio = curBgHeight / this.originHeight;

			const newBgWidth = this.originWidth * changeRatio;

			this.node.getComponent(UITransform).setContentSize(newBgWidth, curBgHeight);
		}

	}

}
