
class MaxHeap {
    constructor() {
        this.storage = [];
        this.size = 0
    }

    isEmpty() {
        return (this.size == 0)
    }

    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    getRightChildIndex(index) {
        return 2 * index + 2;
    }

    hasParent(index) {
        return this.getParentIndex(index) >= 0;
    }

    hasLeftChild(index) {
        return this.getLeftChildIndex(index) < this.size;
    }

    hasRightChild(index) {
        return this.getRightChildIndex(index) < this.size;
    }

    parent(index) {
        return this.storage[this.getParentIndex(index)]
    }

    leftChild(index) {
        return this.storage[this.getLeftChildIndex(index)]
    }

    rightChild(index) {
        return this.storage[this.getRightChildIndex(index)]
    }

    swap(index1, index2) {
        let temp;
        temp = this.storage[index1];
        this.storage[index1] = this.storage[index2];
        this.storage[index2] = temp;

    }

    heapifyUp(index) {
        if (this.hasParent(index) && this.parent(index).dataset.priority < this.storage[index].dataset.priority) {
            this.swap(this.getParentIndex(index), index);
            index = this.getParentIndex(index);
        }
    }

    insert(data) {
        this.storage.push(data);
        this.size = this.size + 1;
        this.heapifyUp(this.size - 1);
    }

    print() {
        console.log(this.storage)
    }

    heapifyDown(index) {
        let largest = index;
        if (this.hasLeftChild(index) && this.storage[largest].dataset.priority < this.leftChild(index).dataset.priority) {
            largest = this.getLeftChildIndex(index);
        }
        if (this.hasRightChild(index) && this.storage[largest].dataset.priority < this.rightChild(index).dataset.priority) {
            largest = this.getRightChildIndex(index);
        }
        if (largest !== index) {
            this.swap(index, largest);
            this.heapifyDown(largest);

        }
    }

    deleteMax() {
        let data = this.storage[0];
        this.storage.splice(0, 1);
        this.size -= 1;
        this.heapifyDown(0);
        return data;
    }
}

let ptree = new MaxHeap()

let queue = document.querySelector('.queue')
let proc = document.querySelector('.washing')
let done = document.querySelector('.done')

let name = document.querySelector('#name')
let pno = document.querySelector('#email')
let cno = document.querySelector('#clothes')
let premium = document.querySelector('#premium')

let addButton = document.querySelector('.add')

let priorities = new Set()

function removeFromDone(event) {
  done.removeChild(event.target)
  priorities.delete(event.target)
}

function moveToDone(event) {
  done.appendChild(event.target)
  event.target.classList.add('done-item')
  event.target.classList.remove('list-item')
  event.target.onclick = removeFromDone
}

function moveToProc(event) {
  if (ptree.isEmpty()) return null
  console.log(ptree)
  let toMove = ptree.deleteMax()
  proc.appendChild(toMove)
  toMove.classList.add('list-item')
  toMove.onclick = moveToDone
}

queue.onclick = moveToProc
addButton.addEventListener('click', (event) => {
  let newItem = document.createElement('li')
  
  let newPriority = parseInt(cno.value) + (premium.checked ? 5 : 0)
  while (priorities.has(newPriority)) {
    console.log('hello')
    newPriority += 0.1
  }
  priorities.add(newPriority)
  console.log(priorities)
  
  newItem.innerText = `${name.value} - ${newPriority.toPrecision(5)}`
  newItem.dataset.name = name.value
  newItem.dataset.email = pno.value
  newItem.dataset.priority = newPriority
  newItem.classList.add('queue-item')
 
  name.value = ''
  pno.value = ''
  cno.value = ''
  
  ptree.insert(newItem)
  queue.appendChild(newItem)
  
})

let sendButton = document.querySelector('#send')
sendButton.onclick = async (event) => {
  let toMail = []
  let peopleToMail = done.childNodes
  let success = true
  for (let i=1; i<peopleToMail.length; i++) {
   let message = await Email.send ({
    Host : "smtp.elasticemail.com",
    Username : "fluffycloud1612@gmail.com",
    Password : "611CAA60B828060E0CC060F0C9EFB2DC5DD2",
    To : peopleToMail[i].dataset.email,
    From : "fluffycloud1612@gmail.com",
    Subject : "Laundry Done!",
    Body : `Hello ${peopleToMail[i].dataset.name.split(" ")[0]}, Your clothes are ready! Please collect it by today.`
  })
   
  if (message !== "OK") {
    alert(`Mail failed to be sent to ${peopleToMail[i].dataset.name}`); 
    success = false
    }
  }
  
  if (success)
     alert("Mail Sent!")
}