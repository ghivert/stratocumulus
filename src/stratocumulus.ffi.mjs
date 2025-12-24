import * as $gleam from './gleam.mjs'
import * as $stratocumulus from './stratocumulus.mjs'

export const bufferedAmount = (ws) => ws.bufferedAmount
export const extensions = (ws) => ws.extensions
export const protocol = (ws) => ws.protocol
export const url = (ws) => ws.url

export function create(url, protocols) {
  try {
    protocols = protocols.toArray()
    const ws = new WebSocket(url, protocols)
    return $gleam.Result$Ok(ws)
  } catch (error) {
    if (error instanceof SyntaxError) {
      const err = $stratocumulus.OpenError$OpenSyntaxError()
      return $gleam.Result$Error(err)
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
    return $gleam.Result$Ok(ws)
  } catch (error) {
    if (error instanceof InvalidStateError) {
      const err = $stratocumulus.SendError$InvalidStateError()
      return $gleam.Result$Error(err)
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
      handler($gleam.toBitArray(event.data), event)
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
    return $gleam.Result$Ok()
  } catch (error) {
    if (error instanceof InvalidAccessError) {
      const err = $stratocumulus.CloseError$InvalidAccessError()
      return $gleam.Result$Error(err)
    } else if (error instanceof SyntaxError) {
      const err = $stratocumulus.CloseError$ReasonSyntaxError()
      return $gleam.Result$Error(err)
    }
  }
}
