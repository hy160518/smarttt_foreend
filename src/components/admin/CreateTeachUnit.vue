<template>
	<el-container style="height: 92vh;">
		<el-header
			style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
			<el-button type="success" v-blur-on-click style="margin-left: 0.8vw;" @click="exportData">导出</el-button>
			<el-button type="primary" v-blur-on-click @click="changeTreeExpand"
				style="margin-left: 0.8vw;">展开/收起全部</el-button>
			<!--            <el-button type="success" style="margin-left: 0.8vw;" >保存</el-button>-->
		</el-header>

		<el-main style="padding: 0;">
			<div style="height: 25px; display: flex; justify-content: space-between; flex: auto; text-align: center;
				background-color: whitesmoke;">
				<div style="width: 390px; color: gray">名称</div>
				<div style="width: 59vw;">
					<div style="display: flex; flex: auto; justify-content: space-between;">
						<div style="width: 200px; border-right: 1px solid #bbbbbb; border-left: 1px solid #bbbbbb;
							color: gray">层级码</div>
						<div style="width: calc(59vw - 200px); color: gray;">备注</div>
					</div>
				</div>
			</div>

			<div class="tree-container" style="height: calc(100% - 25px); overflow: auto;">
				<el-tree :data="treeData" draggable :props="defaultProps" node-key="id" :expand-on-click-node="true"
					ref="nodeExpand" @node-click="handleNodeClick" :default-expanded-keys="expandedKeys"
					:default-expand-all="expandAll" @node-drag-start="handleDragStart" @node-drag-end="handleDragEnd"
					@node-contextmenu="clickNode" @node-expand="openNode" @node-collapse="closeNode">
					<template #default="{ node }">
						<div style="display: flex; justify-content: space-between; flex: auto; text-align: left;">
							<el-popover :visible="node.data.popVisible" placement="right"
								popper-style="background-color: rgba(255, 255, 255, 0.5)">
								<el-button style="margin-top: 6px;width:100%" type="success" plain round
									@click="editNode(node.data)">编辑</el-button><br>
								<el-button style="margin-top: 6px;width:100%" type="primary" plain round
									@click="addSiblingNode(node.data)">同级新增</el-button><br>
								<el-button style="margin-top: 6px;width:100%" type="primary" plain round
									@click="addChildNode(node.data)">下级新增</el-button><br>
								<el-button style="margin-top: 6px;width:100%" type="danger" plain round
									@click="confirmDeleteNodes(node.data)">删除</el-button>
								<template #reference>
									<!-- 这里用一个临时量来存新节点，否则直接绑定node.data.obsname输入框会出问题 -->
									<el-input v-if="node.data.inputVisible" v-model="node.data.tempData"
										@blur="blurInput(node.data)" placeholder="请输入节点名称" @contextmenu.stop
										draggable="false" style="height:25px; width: 200px;"></el-input>
									<div style="width: auto;">
										<el-icon v-if="node.data.children" color="orange">
											<Folder />
										</el-icon>
										<el-icon v-else color="dodgerblue">
											<Document />
										</el-icon>
										{{ node.data.obsname }}
									</div>
								</template>
							</el-popover>

							<div style="width: 59vw;">
								<div style="display: flex; flex: auto; justify-content: space-between;">
									<div style="width: 200px;">
										{{ node.data.levelcode }}
									</div>
									<div class="overflow-text" v-bind:title="node.data.remark">
										{{ node.data.remark }}
									</div>
								</div>
							</div>
						</div>
					</template>
				</el-tree>
			</div>
		</el-main>
	</el-container>
</template>

<script lang="ts" setup>
import { Document, Folder } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
import type { NodeDropType, } from 'element-plus/es/components/tree/src/tree.type'
import { ref, reactive, onMounted, nextTick, onBeforeUnmount } from 'vue'
import request from '../../utils/request'
import { exportTreeToCSV } from "../../utils/exportTreeToCSV";

//树数据
const treeData = ref([]);
const expandedKeys = ref([]); // 用于存储展开的节点的键值
const nodeExpand = ref(null);


const nullNodeNum = ref(0);
//展开所有或收起所有
const expandAll = ref(false);
const expandtip = ref('');
//展开所有或收起所有
const changeTreeExpand = () => {
	expandAll.value = !expandAll.value;
	for (let i = 0; i < nodeExpand.value.store._getAllNodes().length; i++) {
		nodeExpand.value.store._getAllNodes()[i].expanded = expandAll.value;
	}
}

/********初始树数据*********************/

const defaultProps = {
	children: 'children',
	label: 'obsname',
	expanded: 'expanded'
}

//获取初始教学单位数据
const getTreeData = () => {
	request.admin.get('/sysmangt/units').then((res) => {
		if (res.code === 200) {
			treeData.value = res.data;
			nullNodeNum.value = 0;
			initialize(treeData.value);
			// console.log("getTreeData 被触发");
			console.log(treeData.value)
		}
	}).catch(() => {
		ElMessage({
			type: 'error',
			message: '获取教学单位失败'
		});
	});
};

// 递归初始化popVisible
const initialize = (nodes) => {
	nodes.forEach((node) => {
		node.popVisible = false;
		node.inputVisible = false;
		node.tempData = '';

		if (node.obsname.includes('未命名节点')) {
			if (node.obsname.length > 5) {
				let num = '';
				for (let i = 6; node.obsname[i] !== ')'; i++) {
					num += node.obsname[i];
				}
				if (nullNodeNum.value < Number(num)) nullNodeNum.value = Number(num);
				
			}
			else if (node.obsname.length === 5 && nullNodeNum.value === 0) nullNodeNum.value++;
		}

		if (node.children && node.children.length > 0) {
			initialize(node.children); // 递归子节点
		}
	});
};

/*****************************/





/*********************删除节点****************************/
const confirmDeleteNodes = (deletedNode) => {
	// console.log(deletedNode)
	// 检查节点是否有子节点
	if (deletedNode.children && deletedNode.children.length > 0) {
		// 如果有子节点，显示错误提示并阻止删除
		ElMessage({
			type: 'error',
			message: '请先删除子节点',
		});
		deletedNode.popVisible = false;
	} else {
		// 如果没有子节点，询问用户是否真的要删除该节点
		ElMessageBox.confirm(
			`是否删除节点 "${deletedNode.obsname}"?`, // 使用节点的名字
			'警告',
			{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}
		).then(() => {
			deleteNodes(deletedNode);
		}).catch(() => {
			// 用户取消操作
			deletedNode.popVisible = false; // 假设这样可以关闭弹窗
		});
	}
}

const deleteNodes = (deletedNode) => {
	const idlist = [];
	idlist.push(deletedNode.id);
	console.log(idlist);
	request.admin.post('/sysmangt/units/delete', idlist)
		.then(res => {
			if (res.code === 200) {
				ElMessage({
					type: 'success',
					message: `节点 "${deletedNode.obsname}已删除`
				})
				getTreeData();
			}
		}).catch(error => {
			ElMessage({
				type: 'error',
				message: '删除节点失败'
			});
		});
};
/********************************************************/
/**********************导出功能****************************/
const columns = [
	{ prop: 'obsname', label: '教学单位名称' },
	{ prop: 'obsdeep', label: '深度' },
	{ prop: 'orderno', label: '序号' },
	{ prop: 'levelcode', label: '层级代码' }
];
const exportData = () => {
	exportTreeToCSV(treeData.value, columns);
}
/*********************************************************/


/**************************树型展开折叠逻辑******************/
//获取展开id
const openNode = (nodeData, node) => {
	if (!expandedKeys.value.includes(node.key)) {
		expandedKeys.value.push(node.key);
	}
	// console.log(expandedKeys.value)
};

//递归移除子节点id
const removeExpandedKeys = (node) => {
	// 首先递归地移除所有子节点的ID
	if (node.childNodes && node.childNodes.length > 0) {
		node.childNodes.forEach(childNode => {
			removeExpandedKeys(childNode);
		});
	}

	// 然后移除当前节点的ID
	const index = expandedKeys.value.indexOf(node.key);
	if (index > -1) {
		expandedKeys.value.splice(index, 1);
	}
};

const closeNode = (nodeData, node) => {
	removeExpandedKeys(node);
	// console.log(expandedKeys.value);
};

/*********************************************************/


/**************************处理节点新增逻辑******************/
//同级新增事件
const addSiblingNode = async (addedNode) => {
	nullNodeNum.value += 1;
	const newNodeData = {
		id: addedNode.id,
		pid: addedNode.pid,
		obsdeep: addedNode.obsdeep.toString(), //点击的obs的obsdeep
		type: "1", // type为1为同级新增，type为0为下级新增
		smObs: { // 新增的数据
			obsname: nullNodeNum.value > 1 ? '未命名节点(' + nullNodeNum.value + ')' : '未命名节点',
			remark: ""
		}
	};
	request.admin.post('/sysmangt/units/create', newNodeData)
		.then(res => {
			if (res.code === 200) {
				ElMessage({
					type: 'success',
					message: `新增同级教学单位成功`
				})
				getTreeData();
			}
		}).catch(error => {
			ElMessage({
				type: 'error',
				message: '新增同级级教学单位失败'
			});
		});
};

//下级新增事件
const addChildNode = (addedNode) => {
	nullNodeNum.value += 1;
	const newNodeData = ref(
		{
			id: addedNode.id,
			pid: addedNode.pid,
			obsdeep: addedNode.obsdeep.toString(),//点击的obs的obsdeep
			type: "2",//type为1为同级新增，type为0为下级新增
			smObs: {//新增的数据
				obsname: nullNodeNum.value > 1 ? '未命名节点(' + nullNodeNum.value + ')' : '未命名节点',
				remark: ""
			}
		}
	)
	request.admin.post('/sysmangt/units/create', newNodeData.value)
		.then(res => {
			if (res.code === 200) {
				ElMessage({
					type: 'success',
					message: `新增下级教学单位成功`
				})
				expandedKeys.value.push(addedNode.id); //将该节点id追加到展开的id中
				getTreeData();
			}
		}).catch(error => {
			ElMessage({
				type: 'error',
				message: '新增下级教学单位失败'
			});
		});
}
/***************************************************/






function findParentNode(nodes, parentId, parent = null) {
	for (const node of nodes) {
		if (node.id === parentId) {
			return parent;
		}
		if (node.children && node.children.length) {
			const found = findParentNode(node.children, parentId, node);
			if (found) {
				return found;
			}
		}
	}
	return null;
}



const handleDragStart = (draggingNode: Node, ev: DragEvents) => {   // 拖动某个节点的一瞬间触发
	findParent(draggingNode.data);  // 记录被拖拽节点在拖拽之前的父节点
}

const handleDragEnd = (     // 放置节点的时候触发
	draggingNode: Node,
	dropNode: Node,
	dropType: NodeDropType,
	ev: DragEvents
) => {
	// console.log('tree drag end:', dropNode, dropType);
	if (dropType === 'none') return;    // 没有改变节点位置
	if (parentData.value.parentNode && parentData.value.parentNode.children.length === 0) {
		// 如果被拖拽节点拖拽之前的父节点在拖拽之后不存在子节点了，就删除子节点字段
		delete parentData.value.parentNode.children;
	}
	if (dropType === 'before') {      // 拖拽为同级节点并且在目标节点之前
		insertDraggingNode(draggingNode.data, dropNode.data, dropType);
		deleteOldDraggingNode(draggingNode.data);
	}
	else if (dropType === 'inner') {   // 拖拽为目标节点的内层节点
		if (!dropNode.data.children) dropNode.data.children = [];
		dropNode.data.children.push(draggingNode.data);
		deleteOldDraggingNode(draggingNode.data);
	}
	else if (dropType === 'after') {  // 拖拽为同级节点且在目标节点之后
		insertDraggingNode(draggingNode.data, dropNode.data, dropType);
		deleteOldDraggingNode(draggingNode.data);
	}
	parentData.value = { parentNode: null, childrenIndex: null };
	// console.log(treeData.value);
};

const parentData = ref({ parentNode: null, childrenIndex: null });    // 记录被拖拽节点的父节点


const findParent = (childNode, nodes = treeData.value, parent = null) => {  // 递归查找父节点
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i].obsname === childNode.obsname) {
			if (parent) {
				parentData.value = { parentNode: parent, childrenIndex: i };
			}
			else parentData.value = { parentNode: null, childrenIndex: i };
			return true;
		}
		if (nodes[i].children && nodes[i].children.length > 0) {
			if (findParent(childNode, nodes[i].children, nodes[i])) return true;
		}
	}
	return false;
};

const insertDraggingNode = (draggingNode, dropNode, dropType) => {  // 将节点插入的操作
	findParent(dropNode);   // 查找目标节点的父节点
	if (dropType === 'before') dropType = 0;     // 放在目标节点之前
	else if (dropType === 'after') dropType = 1; // 放在目标节点之后
	if (!parentData.value.parentNode) {
		treeData.value.splice(parentData.value.childrenIndex + dropType, 0, draggingNode);
	}
	else {
		parentData.value.parentNode.children.splice(parentData.value.childrenIndex + dropType, 0, draggingNode);
	}
};

const deleteOldDraggingNode = (draggingNode) => {   // 删除被拖拽节点之前的信息
	findParent(draggingNode);
	if (!parentData.value.parentNode) {
		treeData.value.splice(parentData.value.childrenIndex, 1);
	}
	else {
		parentData.value.parentNode.children.splice(parentData.value.childrenIndex, 1);
	}
};




/**************************与打开弹窗有关*********************/

const openedPopNode = ref({});    // 记录哪个节点的弹出框被打开了

const clickNode = (event, node, dom) => {   // 右键节点触发
	//event为必须参数鼠标点击对象，node为节点的数据是可选参数，dom是当前节点的DOM元素也是可选参数
	if (openedPopNode.value) {
		openedPopNode.value.popVisible = false; // 防止多个弹出框一块显示，不好看
		openedPopNode.value = {};
	}
	node.popVisible = true;
	openedPopNode.value = node;
}

const closePopNode = (event) => {
	// 检查点击事件是否在弹窗内部
	// 如果不是，则关闭弹窗
	if (openedPopNode.value && !event.target.closest('.el-popover')) {
		openedPopNode.value.popVisible = false;
		openedPopNode.value = {};
	}
};

const handleNodeClick = (data, node, event) => {
	// 在这里添加你的其他节点点击逻辑（如果有的话）

	// 关闭弹窗
	if (openedPopNode.value && openedPopNode.value.popVisible) {
		openedPopNode.value.popVisible = false;
		openedPopNode.value = {}; // 重置 openedPopNode
	}
};

onBeforeUnmount(() => {
	document.removeEventListener('click', closePopNode);
});

/***********************************************/

const editNode = (node) => {
	node.tempData = node.obsname;
	node.inputVisible = true;
	node.popVisible = false;
}

const blurInput = (node) => {
	if (node.tempData !== '' && node.tempData !== node.obsname) {
		if (node.tempData.includes('未命名节点')) {
			ElMessage.error('命名不可包含“未命名节点”');
		}
		else {
			node.obsname = node.tempData;
			node.tempData = '';
		}
	}
	node.inputVisible = false;
}


onMounted(() => {
	getTreeData();
	document.addEventListener('click', closePopNode);
})
</script>
<style scoped>

.overflow-text {
    width: calc(59vw - 200px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

/* 去掉滚动条 */
.tree-container::-webkit-scrollbar {	/* 针对Chrome, Safari, Edge, 和 Opera */
	display: none;
}

.element {		/* 针对Firefox */
  /* scrollbar-width: none; */
}

.element {		/* 针对IE和Edge旧版本 */
  /* -ms-overflow-style: none; */
}
/*************/

</style>