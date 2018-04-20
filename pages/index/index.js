Page({
  data:{
    input: '',
    todos: [],
    logs: [],
    leftCount: 0,
    allCompleted: false,
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    this.load();
  },
  // ===== 自定义方法方法 ====
  save: function () {
    wx.setStorageSync('todo_list', this.data.todos);
    wx.setStorageSync('todo_logs', this.data.logs);
  },
  load: function () {
    let todos = wx.getStorageSync('todo_list');
    if (todos) {
      let leftCount = todos.filter((n) => {
        return !n.completed;
      }).length;
      this.setData({ 
        todos: todos,
        leftCount: leftCount,
      });
    }
    let logs = wx.getStorageSync('todo_logs');
    if (logs) this.setData({ logs: logs }); 

  },
  // ===== 事件处理 ====
  inputChageHandel: function(e){
    console.log('inputChageHandel',e);
    this.setData({
      input: e.detail.value
    });
  },
  addTodoHandle: function(e){
    console.log('addTodoHandle', e);
    if (!this.data.input || !this.data.input.trim()) return;
    let todos = this.data.todos;
    todos.push({ name: this.data.input, completed: false });
    var logs = this.data.logs;
    logs.push({ timestamp: new Date().toLocaleString(), action: '新增', name: this.data.input });
    this.setData({
      input: '',
      todos: todos,
      leftCount: this.data.leftCount + 1,
      logs: logs
    });
    this.save();
  },
  toggleTodoHandle: function (e) {
    let index = e.currentTarget.dataset.index;
    let todos = this.data.todos;
    todos[index].completed = !todos[index].completed;
    let logs = this.data.logs;
    logs.push({
      timestamp: new Date().toLocaleString(),
      action: todos[index].completed ? '标记完成' : '标记未完成',
      name: todos[index].name
    });
    this.setData({
      todos: todos,
      leftCount: this.data.leftCount + (todos[index].completed ? -1 : 1),
      logs: logs
    });
    this.save();
  },
  removeTodoHandle: function (e) {
    let index = e.currentTarget.dataset.index;
    let todos = this.data.todos;
    let remove = todos.splice(index, 1)[0];
    let logs = this.data.logs;
    logs.push({ timestamp: new Date().toLocaleString(), active: '删除', name: remove.name });
    this.setData({
      todos: todos,
      logs: logs,
      leftCount: this.leftCount - 1,
    });
    this.save();
  },
  toggleAllHandle: function (e) {
    this.data.allCompleted = !this.data.allCompleted;
    let todos = this.data.todos;
    for (var i = todos.length - 1; i >= 0; i--) {
      todos[i].completed = this.data.allCompleted;
    }
    let logs = this.data.logs;
    logs.push({
      timestamp: new Date(),
      action: this.data.allCompleted ? '标记完成' : '标记未完成',
      name: '全部任务'
    });
    this.setData({
      todos: todos,
      leftCount: this.data.allCompleted ? 0 : todos.length,
      logs: logs
    });
    this.save();
  },
  clearCompletedHandle: function (e) {
    let todos = this.data.todos;
    let remains = [];
    for (var i = 0; i < todos.length; i++) {
      todos[i].completed || remains.push(todos[i]);
    }
    let logs = this.data.logs;
    logs.push({
      timestamp: new Date(),
      action: '清空',
      name: '已完成任务'
    });
    this.setData({ todos: remains, logs: logs });
    this.save();
  }
});