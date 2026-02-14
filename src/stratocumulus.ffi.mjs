import * as _ from './gleam.mjs'
import * as $stratocumulus from './stratocumulus.mjs'

export const bufferedAmount = (ws) => ws.bufferedAmount
export const extensions = (ws) => ws.extensions
export const protocol = (ws) => ws.protocol
export const url = (ws) => ws.url

export function create(url, protocols) {
  try {
    protocols = protocols.toArray()
    const ws = new WebSocket(url, protocols)
    return _.Result$Ok(ws)
  } catch (error) {
    if (error instanceof DOMException) {
      if (error.name === 'SyntaxError') {
        const err = $stratocumulus.OpenError$OpenSyntaxError()
        return _.Result$Error(err)
      }
    }
  }
}

// prettier-ignore
export function readyState(ws) {
  switch (ws.readyState) {
    case WebSocket.CONNECTING: return $stratocumulus.ReadyState$Connecting()
    case WebSocket.OPEN: return $stratocumulus.ReadyState$Open()
    case WebSocket.CLOSING: return $stratocumulus.ReadyState$Closing()
    case WebSocket.CLOSED: return $stratocumulus.ReadyState$Closed()
  }
}

export function send(ws, content) {
  try {
    const data = content.rawBuffer !== undefined ? content.rawBuffer : content
    ws.send(data)
    return _.Result$Ok(ws)
  } catch (error) {
    if (error instanceof DOMException) {
      if (error.name === 'InvalidStateError') {
        const err = $stratocumulus.SendError$InvalidStateError()
        return _.Result$Error(err)
      }
    }
  }
}

export function addStringMessageListener(ws, handler) {
  ws.addEventListener('message', function (event) {
    if (typeof event.data === 'string') {
      handler(event.data, event)
    }
  })
  return ws
}

export function addBitArrayMessageListener(ws, handler) {
  ws.addEventListener('message', function (event) {
    if (event.data instanceof Uint8Array) {
      handler(_.toBitArray(event.data), event)
    }
  })
  return ws
}

export function addEventListener(ws, event, handler) {
  ws.addEventListener(event, handler)
  return ws
}

export function close(ws, code, reason) {
  try {
    ws.close(code, reason)
    return _.Result$Ok()
  } catch (error) {
    if (error instanceof DOMException) {
      if (error.name === 'InvalidAccessError') {
        const err = $stratocumulus.CloseError$InvalidAccessError()
        return _.Result$Error(err)
      } else if (error.name === 'SyntaxError') {
        const err = $stratocumulus.CloseError$ReasonSyntaxError()
        return _.Result$Error(err)
      }
    }
  }
}
