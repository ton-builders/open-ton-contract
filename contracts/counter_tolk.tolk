// simple counter contract in Tolk language

// 任意的 32 位二进制对应的数字，要求是“必须”要和wrappers目录中 TypeScript 合约包装代码一致。
// 默认的做法是用对变量字符串取 hash 或者 CRC32 之类的转换而来，但是这个不是强制的。
const OP_INCREASE = 0x7e8764ef;

global ctxID: int;
global ctxCounter: int;

// loadData populates storage variables from persistent storage
fun loadData() {
    var ds = getContractData().beginParse();

    ctxID = ds.loadUint(32);
    ctxCounter = ds.loadUint(32);

    ds.assertEndOfSlice();
}

// saveData stores storage variables as a cell into persistent storage
fun saveData() {
    setContractData(
    beginCell()
    .storeUint(ctxID, 32)
    .storeUint(ctxCounter, 32)
    .endCell()
    );
}

// onInternalMessage is the main entrypoint; it's called when a contract receives an internal message from other contracts
fun onInternalMessage(myBalance: int, msgValue: int, msgFull: cell, msgBody: slice) {
    if (msgBody.isEndOfSlice()) {
        // ignore all empty messages
        return ;
    }

    var cs: slice = msgFull.beginParse();
    val flags = cs.loadMessageFlags();
    if (isMessageBounced(flags)) {
        // ignore all bounced messages
        return ;
    }

    loadData(); // here we populate the storage variables

    val op = msgBody.loadMessageOp(); // by convention, the first 32 bits of incoming message is the op
    val queryID = msgBody.loadMessageQueryId(); // also by convention, the next 64 bits contain the "query id", although this is not always the case

    if (op == OP_INCREASE) {
        val increaseBy = msgBody.loadUint(32);
        ctxCounter += increaseBy;
        saveData();
        return ;
    }

    throw 0xffff; // if the message contains an op that is not known to this contract, we throw
}

// get methods are a means to conveniently read contract data using, for example, HTTP APIs
// note that unlike in many other smart contract VMs, get methods cannot be called by other contracts

get currentCounter(): int {
    loadData();
    return ctxCounter;
}

get initialId(): int {
    loadData();
    return ctxID;
}
