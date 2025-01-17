// node_modules/preact/dist/preact.module.js
var n;
var l;
var u;
var t;
var i;
var o;
var r;
var f;
var e;
var c;
var s;
var a;
var h = {};
var v = [];
var p = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var y = Array.isArray;
function d(n2, l2) {
  for (var u2 in l2)
    n2[u2] = l2[u2];
  return n2;
}
function w(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function _(l2, u2, t2) {
  var i2, o2, r2, f2 = {};
  for (r2 in u2)
    r2 == "key" ? i2 = u2[r2] : r2 == "ref" ? o2 = u2[r2] : f2[r2] = u2[r2];
  if (arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), typeof l2 == "function" && l2.defaultProps != null)
    for (r2 in l2.defaultProps)
      f2[r2] === undefined && (f2[r2] = l2.defaultProps[r2]);
  return g(l2, f2, i2, o2, null);
}
function g(n2, t2, i2, o2, r2) {
  var f2 = { type: n2, props: t2, key: i2, ref: o2, __k: null, __: null, __b: 0, __e: null, __d: undefined, __c: null, constructor: undefined, __v: r2 == null ? ++u : r2, __i: -1, __u: 0 };
  return r2 == null && l.vnode != null && l.vnode(f2), f2;
}
function b(n2) {
  return n2.children;
}
function k(n2, l2) {
  this.props = n2, this.context = l2;
}
function x(n2, l2) {
  if (l2 == null)
    return n2.__ ? x(n2.__, n2.__i + 1) : null;
  for (var u2;l2 < n2.__k.length; l2++)
    if ((u2 = n2.__k[l2]) != null && u2.__e != null)
      return u2.__e;
  return typeof n2.type == "function" ? x(n2) : null;
}
function C(n2) {
  var l2, u2;
  if ((n2 = n2.__) != null && n2.__c != null) {
    for (n2.__e = n2.__c.base = null, l2 = 0;l2 < n2.__k.length; l2++)
      if ((u2 = n2.__k[l2]) != null && u2.__e != null) {
        n2.__e = n2.__c.base = u2.__e;
        break;
      }
    return C(n2);
  }
}
function S(n2) {
  (!n2.__d && (n2.__d = true) && i.push(n2) && !M.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || r)(M);
}
function M() {
  var n2, u2, t2, o2, r2, e2, c2, s2;
  for (i.sort(f);n2 = i.shift(); )
    n2.__d && (u2 = i.length, o2 = undefined, e2 = (r2 = (t2 = n2).__v).__e, c2 = [], s2 = [], t2.__P && ((o2 = d({}, r2)).__v = r2.__v + 1, l.vnode && l.vnode(o2), O(t2.__P, o2, r2, t2.__n, t2.__P.namespaceURI, 32 & r2.__u ? [e2] : null, c2, e2 == null ? x(r2) : e2, !!(32 & r2.__u), s2), o2.__v = r2.__v, o2.__.__k[o2.__i] = o2, j(c2, o2, s2), o2.__e != e2 && C(o2)), i.length > u2 && i.sort(f));
  M.__r = 0;
}
function P(n2, l2, u2, t2, i2, o2, r2, f2, e2, c2, s2) {
  var a2, p2, y2, d2, w2, _2 = t2 && t2.__k || v, g2 = l2.length;
  for (u2.__d = e2, $(u2, l2, _2), e2 = u2.__d, a2 = 0;a2 < g2; a2++)
    (y2 = u2.__k[a2]) != null && (p2 = y2.__i === -1 ? h : _2[y2.__i] || h, y2.__i = a2, O(n2, y2, p2, i2, o2, r2, f2, e2, c2, s2), d2 = y2.__e, y2.ref && p2.ref != y2.ref && (p2.ref && N(p2.ref, null, y2), s2.push(y2.ref, y2.__c || d2, y2)), w2 == null && d2 != null && (w2 = d2), 65536 & y2.__u || p2.__k === y2.__k ? e2 = I(y2, e2, n2) : typeof y2.type == "function" && y2.__d !== undefined ? e2 = y2.__d : d2 && (e2 = d2.nextSibling), y2.__d = undefined, y2.__u &= -196609);
  u2.__d = e2, u2.__e = w2;
}
function $(n2, l2, u2) {
  var t2, i2, o2, r2, f2, e2 = l2.length, c2 = u2.length, s2 = c2, a2 = 0;
  for (n2.__k = [], t2 = 0;t2 < e2; t2++)
    (i2 = l2[t2]) != null && typeof i2 != "boolean" && typeof i2 != "function" ? (r2 = t2 + a2, (i2 = n2.__k[t2] = typeof i2 == "string" || typeof i2 == "number" || typeof i2 == "bigint" || i2.constructor == String ? g(null, i2, null, null, null) : y(i2) ? g(b, { children: i2 }, null, null, null) : i2.constructor === undefined && i2.__b > 0 ? g(i2.type, i2.props, i2.key, i2.ref ? i2.ref : null, i2.__v) : i2).__ = n2, i2.__b = n2.__b + 1, o2 = null, (f2 = i2.__i = L(i2, u2, r2, s2)) !== -1 && (s2--, (o2 = u2[f2]) && (o2.__u |= 131072)), o2 == null || o2.__v === null ? (f2 == -1 && a2--, typeof i2.type != "function" && (i2.__u |= 65536)) : f2 !== r2 && (f2 == r2 - 1 ? a2-- : f2 == r2 + 1 ? a2++ : (f2 > r2 ? a2-- : a2++, i2.__u |= 65536))) : i2 = n2.__k[t2] = null;
  if (s2)
    for (t2 = 0;t2 < c2; t2++)
      (o2 = u2[t2]) != null && (131072 & o2.__u) == 0 && (o2.__e == n2.__d && (n2.__d = x(o2)), V(o2, o2));
}
function I(n2, l2, u2) {
  var t2, i2;
  if (typeof n2.type == "function") {
    for (t2 = n2.__k, i2 = 0;t2 && i2 < t2.length; i2++)
      t2[i2] && (t2[i2].__ = n2, l2 = I(t2[i2], l2, u2));
    return l2;
  }
  n2.__e != l2 && (l2 && n2.type && !u2.contains(l2) && (l2 = x(n2)), u2.insertBefore(n2.__e, l2 || null), l2 = n2.__e);
  do {
    l2 = l2 && l2.nextSibling;
  } while (l2 != null && l2.nodeType === 8);
  return l2;
}
function L(n2, l2, u2, t2) {
  var { key: i2, type: o2 } = n2, r2 = u2 - 1, f2 = u2 + 1, e2 = l2[u2];
  if (e2 === null || e2 && i2 == e2.key && o2 === e2.type && (131072 & e2.__u) == 0)
    return u2;
  if (t2 > (e2 != null && (131072 & e2.__u) == 0 ? 1 : 0))
    for (;r2 >= 0 || f2 < l2.length; ) {
      if (r2 >= 0) {
        if ((e2 = l2[r2]) && (131072 & e2.__u) == 0 && i2 == e2.key && o2 === e2.type)
          return r2;
        r2--;
      }
      if (f2 < l2.length) {
        if ((e2 = l2[f2]) && (131072 & e2.__u) == 0 && i2 == e2.key && o2 === e2.type)
          return f2;
        f2++;
      }
    }
  return -1;
}
function T(n2, l2, u2) {
  l2[0] === "-" ? n2.setProperty(l2, u2 == null ? "" : u2) : n2[l2] = u2 == null ? "" : typeof u2 != "number" || p.test(l2) ? u2 : u2 + "px";
}
function A(n2, l2, u2, t2, i2) {
  var o2;
  n:
    if (l2 === "style")
      if (typeof u2 == "string")
        n2.style.cssText = u2;
      else {
        if (typeof t2 == "string" && (n2.style.cssText = t2 = ""), t2)
          for (l2 in t2)
            u2 && l2 in u2 || T(n2.style, l2, "");
        if (u2)
          for (l2 in u2)
            t2 && u2[l2] === t2[l2] || T(n2.style, l2, u2[l2]);
      }
    else if (l2[0] === "o" && l2[1] === "n")
      o2 = l2 !== (l2 = l2.replace(/(PointerCapture)$|Capture$/i, "$1")), l2 = l2.toLowerCase() in n2 || l2 === "onFocusOut" || l2 === "onFocusIn" ? l2.toLowerCase().slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + o2] = u2, u2 ? t2 ? u2.u = t2.u : (u2.u = e, n2.addEventListener(l2, o2 ? s : c, o2)) : n2.removeEventListener(l2, o2 ? s : c, o2);
    else {
      if (i2 == "http://www.w3.org/2000/svg")
        l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if (l2 != "width" && l2 != "height" && l2 != "href" && l2 != "list" && l2 != "form" && l2 != "tabIndex" && l2 != "download" && l2 != "rowSpan" && l2 != "colSpan" && l2 != "role" && l2 != "popover" && l2 in n2)
        try {
          n2[l2] = u2 == null ? "" : u2;
          break n;
        } catch (n3) {
        }
      typeof u2 == "function" || (u2 == null || u2 === false && l2[4] !== "-" ? n2.removeAttribute(l2) : n2.setAttribute(l2, l2 == "popover" && u2 == 1 ? "" : u2));
    }
}
function F(n2) {
  return function(u2) {
    if (this.l) {
      var t2 = this.l[u2.type + n2];
      if (u2.t == null)
        u2.t = e++;
      else if (u2.t < t2.u)
        return;
      return t2(l.event ? l.event(u2) : u2);
    }
  };
}
function O(n2, u2, t2, i2, o2, r2, f2, e2, c2, s2) {
  var a2, h2, v2, p2, w2, _2, g2, m, x2, C2, S2, M2, $2, I2, H, L2, T2 = u2.type;
  if (u2.constructor !== undefined)
    return null;
  128 & t2.__u && (c2 = !!(32 & t2.__u), r2 = [e2 = u2.__e = t2.__e]), (a2 = l.__b) && a2(u2);
  n:
    if (typeof T2 == "function")
      try {
        if (m = u2.props, x2 = "prototype" in T2 && T2.prototype.render, C2 = (a2 = T2.contextType) && i2[a2.__c], S2 = a2 ? C2 ? C2.props.value : a2.__ : i2, t2.__c ? g2 = (h2 = u2.__c = t2.__c).__ = h2.__E : (x2 ? u2.__c = h2 = new T2(m, S2) : (u2.__c = h2 = new k(m, S2), h2.constructor = T2, h2.render = q), C2 && C2.sub(h2), h2.props = m, h2.state || (h2.state = {}), h2.context = S2, h2.__n = i2, v2 = h2.__d = true, h2.__h = [], h2._sb = []), x2 && h2.__s == null && (h2.__s = h2.state), x2 && T2.getDerivedStateFromProps != null && (h2.__s == h2.state && (h2.__s = d({}, h2.__s)), d(h2.__s, T2.getDerivedStateFromProps(m, h2.__s))), p2 = h2.props, w2 = h2.state, h2.__v = u2, v2)
          x2 && T2.getDerivedStateFromProps == null && h2.componentWillMount != null && h2.componentWillMount(), x2 && h2.componentDidMount != null && h2.__h.push(h2.componentDidMount);
        else {
          if (x2 && T2.getDerivedStateFromProps == null && m !== p2 && h2.componentWillReceiveProps != null && h2.componentWillReceiveProps(m, S2), !h2.__e && (h2.shouldComponentUpdate != null && h2.shouldComponentUpdate(m, h2.__s, S2) === false || u2.__v === t2.__v)) {
            for (u2.__v !== t2.__v && (h2.props = m, h2.state = h2.__s, h2.__d = false), u2.__e = t2.__e, u2.__k = t2.__k, u2.__k.some(function(n3) {
              n3 && (n3.__ = u2);
            }), M2 = 0;M2 < h2._sb.length; M2++)
              h2.__h.push(h2._sb[M2]);
            h2._sb = [], h2.__h.length && f2.push(h2);
            break n;
          }
          h2.componentWillUpdate != null && h2.componentWillUpdate(m, h2.__s, S2), x2 && h2.componentDidUpdate != null && h2.__h.push(function() {
            h2.componentDidUpdate(p2, w2, _2);
          });
        }
        if (h2.context = S2, h2.props = m, h2.__P = n2, h2.__e = false, $2 = l.__r, I2 = 0, x2) {
          for (h2.state = h2.__s, h2.__d = false, $2 && $2(u2), a2 = h2.render(h2.props, h2.state, h2.context), H = 0;H < h2._sb.length; H++)
            h2.__h.push(h2._sb[H]);
          h2._sb = [];
        } else
          do {
            h2.__d = false, $2 && $2(u2), a2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s;
          } while (h2.__d && ++I2 < 25);
        h2.state = h2.__s, h2.getChildContext != null && (i2 = d(d({}, i2), h2.getChildContext())), x2 && !v2 && h2.getSnapshotBeforeUpdate != null && (_2 = h2.getSnapshotBeforeUpdate(p2, w2)), P(n2, y(L2 = a2 != null && a2.type === b && a2.key == null ? a2.props.children : a2) ? L2 : [L2], u2, t2, i2, o2, r2, f2, e2, c2, s2), h2.base = u2.__e, u2.__u &= -161, h2.__h.length && f2.push(h2), g2 && (h2.__E = h2.__ = null);
      } catch (n3) {
        if (u2.__v = null, c2 || r2 != null) {
          for (u2.__u |= c2 ? 160 : 128;e2 && e2.nodeType === 8 && e2.nextSibling; )
            e2 = e2.nextSibling;
          r2[r2.indexOf(e2)] = null, u2.__e = e2;
        } else
          u2.__e = t2.__e, u2.__k = t2.__k;
        l.__e(n3, u2, t2);
      }
    else
      r2 == null && u2.__v === t2.__v ? (u2.__k = t2.__k, u2.__e = t2.__e) : u2.__e = z(t2.__e, u2, t2, i2, o2, r2, f2, c2, s2);
  (a2 = l.diffed) && a2(u2);
}
function j(n2, u2, t2) {
  u2.__d = undefined;
  for (var i2 = 0;i2 < t2.length; i2++)
    N(t2[i2], t2[++i2], t2[++i2]);
  l.__c && l.__c(u2, n2), n2.some(function(u3) {
    try {
      n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
        n3.call(u3);
      });
    } catch (n3) {
      l.__e(n3, u3.__v);
    }
  });
}
function z(u2, t2, i2, o2, r2, f2, e2, c2, s2) {
  var a2, v2, p2, d2, _2, g2, m, b2 = i2.props, k2 = t2.props, C2 = t2.type;
  if (C2 === "svg" ? r2 = "http://www.w3.org/2000/svg" : C2 === "math" ? r2 = "http://www.w3.org/1998/Math/MathML" : r2 || (r2 = "http://www.w3.org/1999/xhtml"), f2 != null) {
    for (a2 = 0;a2 < f2.length; a2++)
      if ((_2 = f2[a2]) && "setAttribute" in _2 == !!C2 && (C2 ? _2.localName === C2 : _2.nodeType === 3)) {
        u2 = _2, f2[a2] = null;
        break;
      }
  }
  if (u2 == null) {
    if (C2 === null)
      return document.createTextNode(k2);
    u2 = document.createElementNS(r2, C2, k2.is && k2), c2 && (l.__m && l.__m(t2, f2), c2 = false), f2 = null;
  }
  if (C2 === null)
    b2 === k2 || c2 && u2.data === k2 || (u2.data = k2);
  else {
    if (f2 = f2 && n.call(u2.childNodes), b2 = i2.props || h, !c2 && f2 != null)
      for (b2 = {}, a2 = 0;a2 < u2.attributes.length; a2++)
        b2[(_2 = u2.attributes[a2]).name] = _2.value;
    for (a2 in b2)
      if (_2 = b2[a2], a2 == "children")
        ;
      else if (a2 == "dangerouslySetInnerHTML")
        p2 = _2;
      else if (!(a2 in k2)) {
        if (a2 == "value" && "defaultValue" in k2 || a2 == "checked" && "defaultChecked" in k2)
          continue;
        A(u2, a2, null, _2, r2);
      }
    for (a2 in k2)
      _2 = k2[a2], a2 == "children" ? d2 = _2 : a2 == "dangerouslySetInnerHTML" ? v2 = _2 : a2 == "value" ? g2 = _2 : a2 == "checked" ? m = _2 : c2 && typeof _2 != "function" || b2[a2] === _2 || A(u2, a2, _2, b2[a2], r2);
    if (v2)
      c2 || p2 && (v2.__html === p2.__html || v2.__html === u2.innerHTML) || (u2.innerHTML = v2.__html), t2.__k = [];
    else if (p2 && (u2.innerHTML = ""), P(u2, y(d2) ? d2 : [d2], t2, i2, o2, C2 === "foreignObject" ? "http://www.w3.org/1999/xhtml" : r2, f2, e2, f2 ? f2[0] : i2.__k && x(i2, 0), c2, s2), f2 != null)
      for (a2 = f2.length;a2--; )
        w(f2[a2]);
    c2 || (a2 = "value", C2 === "progress" && g2 == null ? u2.removeAttribute("value") : g2 !== undefined && (g2 !== u2[a2] || C2 === "progress" && !g2 || C2 === "option" && g2 !== b2[a2]) && A(u2, a2, g2, b2[a2], r2), a2 = "checked", m !== undefined && m !== u2[a2] && A(u2, a2, m, b2[a2], r2));
  }
  return u2;
}
function N(n2, u2, t2) {
  try {
    if (typeof n2 == "function") {
      var i2 = typeof n2.__u == "function";
      i2 && n2.__u(), i2 && u2 == null || (n2.__u = n2(u2));
    } else
      n2.current = u2;
  } catch (n3) {
    l.__e(n3, t2);
  }
}
function V(n2, u2, t2) {
  var i2, o2;
  if (l.unmount && l.unmount(n2), (i2 = n2.ref) && (i2.current && i2.current !== n2.__e || N(i2, null, u2)), (i2 = n2.__c) != null) {
    if (i2.componentWillUnmount)
      try {
        i2.componentWillUnmount();
      } catch (n3) {
        l.__e(n3, u2);
      }
    i2.base = i2.__P = null;
  }
  if (i2 = n2.__k)
    for (o2 = 0;o2 < i2.length; o2++)
      i2[o2] && V(i2[o2], u2, t2 || typeof n2.type != "function");
  t2 || w(n2.__e), n2.__c = n2.__ = n2.__e = n2.__d = undefined;
}
function q(n2, l2, u2) {
  return this.constructor(n2, u2);
}
function B(u2, t2, i2) {
  var o2, r2, f2, e2;
  l.__ && l.__(u2, t2), r2 = (o2 = typeof i2 == "function") ? null : i2 && i2.__k || t2.__k, f2 = [], e2 = [], O(t2, u2 = (!o2 && i2 || t2).__k = _(b, null, [u2]), r2 || h, h, t2.namespaceURI, !o2 && i2 ? [i2] : r2 ? null : t2.firstChild ? n.call(t2.childNodes) : null, f2, !o2 && i2 ? i2 : r2 ? r2.__e : t2.firstChild, o2, e2), j(f2, u2, e2);
}
n = v.slice, l = { __e: function(n2, l2, u2, t2) {
  for (var i2, o2, r2;l2 = l2.__; )
    if ((i2 = l2.__c) && !i2.__)
      try {
        if ((o2 = i2.constructor) && o2.getDerivedStateFromError != null && (i2.setState(o2.getDerivedStateFromError(n2)), r2 = i2.__d), i2.componentDidCatch != null && (i2.componentDidCatch(n2, t2 || {}), r2 = i2.__d), r2)
          return i2.__E = i2;
      } catch (l3) {
        n2 = l3;
      }
  throw n2;
} }, u = 0, t = function(n2) {
  return n2 != null && n2.constructor == null;
}, k.prototype.setState = function(n2, l2) {
  var u2;
  u2 = this.__s != null && this.__s !== this.state ? this.__s : this.__s = d({}, this.state), typeof n2 == "function" && (n2 = n2(d({}, u2), this.props)), n2 && d(u2, n2), n2 != null && this.__v && (l2 && this._sb.push(l2), S(this));
}, k.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), S(this));
}, k.prototype.render = b, i = [], r = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f = function(n2, l2) {
  return n2.__v.__b - l2.__v.__b;
}, M.__r = 0, e = 0, c = F(false), s = F(true), a = 0;

// node_modules/preact/hooks/dist/hooks.module.js
var t2;
var r2;
var u2;
var i2;
var o2 = 0;
var f2 = [];
var c2 = l;
var e2 = c2.__b;
var a2 = c2.__r;
var v2 = c2.diffed;
var l2 = c2.__c;
var m = c2.unmount;
var s2 = c2.__;
function d2(n2, t3) {
  c2.__h && c2.__h(r2, n2, o2 || t3), o2 = 0;
  var u3 = r2.__H || (r2.__H = { __: [], __h: [] });
  return n2 >= u3.__.length && u3.__.push({}), u3.__[n2];
}
function y2(n2, u3) {
  var i3 = d2(t2++, 3);
  !c2.__s && C2(i3.__H, u3) && (i3.__ = n2, i3.i = u3, r2.__H.__h.push(i3));
}
function A2(n2) {
  return o2 = 5, T2(function() {
    return { current: n2 };
  }, []);
}
function T2(n2, r3) {
  var u3 = d2(t2++, 7);
  return C2(u3.__H, r3) && (u3.__ = n2(), u3.__H = r3, u3.__h = n2), u3.__;
}
function j2() {
  for (var n2;n2 = f2.shift(); )
    if (n2.__P && n2.__H)
      try {
        n2.__H.__h.forEach(z2), n2.__H.__h.forEach(B2), n2.__H.__h = [];
      } catch (t3) {
        n2.__H.__h = [], c2.__e(t3, n2.__v);
      }
}
c2.__b = function(n2) {
  r2 = null, e2 && e2(n2);
}, c2.__ = function(n2, t3) {
  n2 && t3.__k && t3.__k.__m && (n2.__m = t3.__k.__m), s2 && s2(n2, t3);
}, c2.__r = function(n2) {
  a2 && a2(n2), t2 = 0;
  var i3 = (r2 = n2.__c).__H;
  i3 && (u2 === r2 ? (i3.__h = [], r2.__h = [], i3.__.forEach(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.i = n3.__N = undefined;
  })) : (i3.__h.forEach(z2), i3.__h.forEach(B2), i3.__h = [], t2 = 0)), u2 = r2;
}, c2.diffed = function(n2) {
  v2 && v2(n2);
  var t3 = n2.__c;
  t3 && t3.__H && (t3.__H.__h.length && (f2.push(t3) !== 1 && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t3.__H.__.forEach(function(n3) {
    n3.i && (n3.__H = n3.i), n3.i = undefined;
  })), u2 = r2 = null;
}, c2.__c = function(n2, t3) {
  t3.some(function(n3) {
    try {
      n3.__h.forEach(z2), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B2(n4);
      });
    } catch (r3) {
      t3.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t3 = [], c2.__e(r3, n3.__v);
    }
  }), l2 && l2(n2, t3);
}, c2.unmount = function(n2) {
  m && m(n2);
  var t3, r3 = n2.__c;
  r3 && r3.__H && (r3.__H.__.forEach(function(n3) {
    try {
      z2(n3);
    } catch (n4) {
      t3 = n4;
    }
  }), r3.__H = undefined, t3 && c2.__e(t3, r3.__v));
};
var k2 = typeof requestAnimationFrame == "function";
function w2(n2) {
  var t3, r3 = function() {
    clearTimeout(u3), k2 && cancelAnimationFrame(t3), setTimeout(n2);
  }, u3 = setTimeout(r3, 100);
  k2 && (t3 = requestAnimationFrame(r3));
}
function z2(n2) {
  var t3 = r2, u3 = n2.__c;
  typeof u3 == "function" && (n2.__c = undefined, u3()), r2 = t3;
}
function B2(n2) {
  var t3 = r2;
  n2.__c = n2.__(), r2 = t3;
}
function C2(n2, t3) {
  return !n2 || n2.length !== t3.length || t3.some(function(t4, r3) {
    return t4 !== n2[r3];
  });
}

// node_modules/@preact/signals-core/dist/signals-core.module.js
var i3 = Symbol.for("preact-signals");
function t3() {
  if (!(s3 > 1)) {
    var i4, t4 = false;
    while (h2 !== undefined) {
      var r3 = h2;
      h2 = undefined;
      f3++;
      while (r3 !== undefined) {
        var o3 = r3.o;
        r3.o = undefined;
        r3.f &= -3;
        if (!(8 & r3.f) && c3(r3))
          try {
            r3.c();
          } catch (r4) {
            if (!t4) {
              i4 = r4;
              t4 = true;
            }
          }
        r3 = o3;
      }
    }
    f3 = 0;
    s3--;
    if (t4)
      throw i4;
  } else
    s3--;
}
function r3(i4) {
  if (s3 > 0)
    return i4();
  s3++;
  try {
    return i4();
  } finally {
    t3();
  }
}
var o3 = undefined;
function n2(i4) {
  var t4 = o3;
  o3 = undefined;
  try {
    return i4();
  } finally {
    o3 = t4;
  }
}
var h2 = undefined;
var s3 = 0;
var f3 = 0;
var v3 = 0;
function e3(i4) {
  if (o3 !== undefined) {
    var t4 = i4.n;
    if (t4 === undefined || t4.t !== o3) {
      t4 = { i: 0, S: i4, p: o3.s, n: undefined, t: o3, e: undefined, x: undefined, r: t4 };
      if (o3.s !== undefined)
        o3.s.n = t4;
      o3.s = t4;
      i4.n = t4;
      if (32 & o3.f)
        i4.S(t4);
      return t4;
    } else if (t4.i === -1) {
      t4.i = 0;
      if (t4.n !== undefined) {
        t4.n.p = t4.p;
        if (t4.p !== undefined)
          t4.p.n = t4.n;
        t4.p = o3.s;
        t4.n = undefined;
        o3.s.n = t4;
        o3.s = t4;
      }
      return t4;
    }
  }
}
function u3(i4) {
  this.v = i4;
  this.i = 0;
  this.n = undefined;
  this.t = undefined;
}
u3.prototype.brand = i3;
u3.prototype.h = function() {
  return true;
};
u3.prototype.S = function(i4) {
  if (this.t !== i4 && i4.e === undefined) {
    i4.x = this.t;
    if (this.t !== undefined)
      this.t.e = i4;
    this.t = i4;
  }
};
u3.prototype.U = function(i4) {
  if (this.t !== undefined) {
    var { e: t4, x: r4 } = i4;
    if (t4 !== undefined) {
      t4.x = r4;
      i4.e = undefined;
    }
    if (r4 !== undefined) {
      r4.e = t4;
      i4.x = undefined;
    }
    if (i4 === this.t)
      this.t = r4;
  }
};
u3.prototype.subscribe = function(i4) {
  var t4 = this;
  return E(function() {
    var r4 = t4.value, n3 = o3;
    o3 = undefined;
    try {
      i4(r4);
    } finally {
      o3 = n3;
    }
  });
};
u3.prototype.valueOf = function() {
  return this.value;
};
u3.prototype.toString = function() {
  return this.value + "";
};
u3.prototype.toJSON = function() {
  return this.value;
};
u3.prototype.peek = function() {
  var i4 = o3;
  o3 = undefined;
  try {
    return this.value;
  } finally {
    o3 = i4;
  }
};
Object.defineProperty(u3.prototype, "value", { get: function() {
  var i4 = e3(this);
  if (i4 !== undefined)
    i4.i = this.i;
  return this.v;
}, set: function(i4) {
  if (i4 !== this.v) {
    if (f3 > 100)
      throw new Error("Cycle detected");
    this.v = i4;
    this.i++;
    v3++;
    s3++;
    try {
      for (var r4 = this.t;r4 !== undefined; r4 = r4.x)
        r4.t.N();
    } finally {
      t3();
    }
  }
} });
function d3(i4) {
  return new u3(i4);
}
function c3(i4) {
  for (var t4 = i4.s;t4 !== undefined; t4 = t4.n)
    if (t4.S.i !== t4.i || !t4.S.h() || t4.S.i !== t4.i)
      return true;
  return false;
}
function a3(i4) {
  for (var t4 = i4.s;t4 !== undefined; t4 = t4.n) {
    var r4 = t4.S.n;
    if (r4 !== undefined)
      t4.r = r4;
    t4.S.n = t4;
    t4.i = -1;
    if (t4.n === undefined) {
      i4.s = t4;
      break;
    }
  }
}
function l3(i4) {
  var t4 = i4.s, r4 = undefined;
  while (t4 !== undefined) {
    var o4 = t4.p;
    if (t4.i === -1) {
      t4.S.U(t4);
      if (o4 !== undefined)
        o4.n = t4.n;
      if (t4.n !== undefined)
        t4.n.p = o4;
    } else
      r4 = t4;
    t4.S.n = t4.r;
    if (t4.r !== undefined)
      t4.r = undefined;
    t4 = o4;
  }
  i4.s = r4;
}
function y3(i4) {
  u3.call(this, undefined);
  this.x = i4;
  this.s = undefined;
  this.g = v3 - 1;
  this.f = 4;
}
(y3.prototype = new u3).h = function() {
  this.f &= -3;
  if (1 & this.f)
    return false;
  if ((36 & this.f) == 32)
    return true;
  this.f &= -5;
  if (this.g === v3)
    return true;
  this.g = v3;
  this.f |= 1;
  if (this.i > 0 && !c3(this)) {
    this.f &= -2;
    return true;
  }
  var i4 = o3;
  try {
    a3(this);
    o3 = this;
    var t4 = this.x();
    if (16 & this.f || this.v !== t4 || this.i === 0) {
      this.v = t4;
      this.f &= -17;
      this.i++;
    }
  } catch (i5) {
    this.v = i5;
    this.f |= 16;
    this.i++;
  }
  o3 = i4;
  l3(this);
  this.f &= -2;
  return true;
};
y3.prototype.S = function(i4) {
  if (this.t === undefined) {
    this.f |= 36;
    for (var t4 = this.s;t4 !== undefined; t4 = t4.n)
      t4.S.S(t4);
  }
  u3.prototype.S.call(this, i4);
};
y3.prototype.U = function(i4) {
  if (this.t !== undefined) {
    u3.prototype.U.call(this, i4);
    if (this.t === undefined) {
      this.f &= -33;
      for (var t4 = this.s;t4 !== undefined; t4 = t4.n)
        t4.S.U(t4);
    }
  }
};
y3.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (var i4 = this.t;i4 !== undefined; i4 = i4.x)
      i4.t.N();
  }
};
Object.defineProperty(y3.prototype, "value", { get: function() {
  if (1 & this.f)
    throw new Error("Cycle detected");
  var i4 = e3(this);
  this.h();
  if (i4 !== undefined)
    i4.i = this.i;
  if (16 & this.f)
    throw this.v;
  return this.v;
} });
function w3(i4) {
  return new y3(i4);
}
function _2(i4) {
  var r4 = i4.u;
  i4.u = undefined;
  if (typeof r4 == "function") {
    s3++;
    var n3 = o3;
    o3 = undefined;
    try {
      r4();
    } catch (t4) {
      i4.f &= -2;
      i4.f |= 8;
      g2(i4);
      throw t4;
    } finally {
      o3 = n3;
      t3();
    }
  }
}
function g2(i4) {
  for (var t4 = i4.s;t4 !== undefined; t4 = t4.n)
    t4.S.U(t4);
  i4.x = undefined;
  i4.s = undefined;
  _2(i4);
}
function p2(i4) {
  if (o3 !== this)
    throw new Error("Out-of-order effect");
  l3(this);
  o3 = i4;
  this.f &= -2;
  if (8 & this.f)
    g2(this);
  t3();
}
function b2(i4) {
  this.x = i4;
  this.u = undefined;
  this.s = undefined;
  this.o = undefined;
  this.f = 32;
}
b2.prototype.c = function() {
  var i4 = this.S();
  try {
    if (8 & this.f)
      return;
    if (this.x === undefined)
      return;
    var t4 = this.x();
    if (typeof t4 == "function")
      this.u = t4;
  } finally {
    i4();
  }
};
b2.prototype.S = function() {
  if (1 & this.f)
    throw new Error("Cycle detected");
  this.f |= 1;
  this.f &= -9;
  _2(this);
  a3(this);
  s3++;
  var i4 = o3;
  o3 = this;
  return p2.bind(this, i4);
};
b2.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 2;
    this.o = h2;
    h2 = this;
  }
};
b2.prototype.d = function() {
  this.f |= 8;
  if (!(1 & this.f))
    g2(this);
};
function E(i4) {
  var t4 = new b2(i4);
  try {
    t4.c();
  } catch (i5) {
    t4.d();
    throw i5;
  }
  return t4.d.bind(t4);
}

// node_modules/@preact/signals/dist/signals.module.js
var v4;
var s4;
function l4(n3, i4) {
  l[n3] = i4.bind(null, l[n3] || function() {
  });
}
function d4(n3) {
  if (s4)
    s4();
  s4 = n3 && n3.S();
}
function p3(n3) {
  var r4 = this, f4 = n3.data, o4 = useSignal(f4);
  o4.value = f4;
  var e4 = T2(function() {
    var n4 = r4.__v;
    while (n4 = n4.__)
      if (n4.__c) {
        n4.__c.__$f |= 4;
        break;
      }
    r4.__$u.c = function() {
      var n5;
      if (!t(e4.peek()) && ((n5 = r4.base) == null ? undefined : n5.nodeType) === 3)
        r4.base.data = e4.peek();
      else {
        r4.__$f |= 1;
        r4.setState({});
      }
    };
    return w3(function() {
      var n5 = o4.value.value;
      return n5 === 0 ? 0 : n5 === true ? "" : n5 || "";
    });
  }, []);
  return e4.value;
}
p3.displayName = "_st";
Object.defineProperties(u3.prototype, { constructor: { configurable: true, value: undefined }, type: { configurable: true, value: p3 }, props: { configurable: true, get: function() {
  return { data: this };
} }, __b: { configurable: true, value: 1 } });
l4("__b", function(n3, r4) {
  if (typeof r4.type == "string") {
    var i4, t4 = r4.props;
    for (var f4 in t4)
      if (f4 !== "children") {
        var o4 = t4[f4];
        if (o4 instanceof u3) {
          if (!i4)
            r4.__np = i4 = {};
          i4[f4] = o4;
          t4[f4] = o4.peek();
        }
      }
  }
  n3(r4);
});
l4("__r", function(n3, r4) {
  d4();
  var i4, t4 = r4.__c;
  if (t4) {
    t4.__$f &= -2;
    if ((i4 = t4.__$u) === undefined)
      t4.__$u = i4 = function(n4) {
        var r5;
        E(function() {
          r5 = this;
        });
        r5.c = function() {
          t4.__$f |= 1;
          t4.setState({});
        };
        return r5;
      }();
  }
  v4 = t4;
  d4(i4);
  n3(r4);
});
l4("__e", function(n3, r4, i4, t4) {
  d4();
  v4 = undefined;
  n3(r4, i4, t4);
});
l4("diffed", function(n3, r4) {
  d4();
  v4 = undefined;
  var i4;
  if (typeof r4.type == "string" && (i4 = r4.__e)) {
    var { __np: t4, props: f4 } = r4;
    if (t4) {
      var o4 = i4.U;
      if (o4)
        for (var e4 in o4) {
          var u4 = o4[e4];
          if (u4 !== undefined && !(e4 in t4)) {
            u4.d();
            o4[e4] = undefined;
          }
        }
      else
        i4.U = o4 = {};
      for (var a4 in t4) {
        var c4 = o4[a4], s5 = t4[a4];
        if (c4 === undefined) {
          c4 = _3(i4, a4, s5, f4);
          o4[a4] = c4;
        } else
          c4.o(s5, f4);
      }
    }
  }
  n3(r4);
});
function _3(n3, r4, i4, t4) {
  var f4 = r4 in n3 && n3.ownerSVGElement === undefined, o4 = d3(i4);
  return { o: function(n4, r5) {
    o4.value = n4;
    t4 = r5;
  }, d: E(function() {
    var i5 = o4.value.value;
    if (t4[r4] !== i5) {
      t4[r4] = i5;
      if (f4)
        n3[r4] = i5;
      else if (i5)
        n3.setAttribute(r4, i5);
      else
        n3.removeAttribute(r4);
    }
  }) };
}
l4("unmount", function(n3, r4) {
  if (typeof r4.type == "string") {
    var i4 = r4.__e;
    if (i4) {
      var t4 = i4.U;
      if (t4) {
        i4.U = undefined;
        for (var f4 in t4) {
          var o4 = t4[f4];
          if (o4)
            o4.d();
        }
      }
    }
  } else {
    var e4 = r4.__c;
    if (e4) {
      var u4 = e4.__$u;
      if (u4) {
        e4.__$u = undefined;
        u4.d();
      }
    }
  }
  n3(r4);
});
l4("__h", function(n3, r4, i4, t4) {
  if (t4 < 3 || t4 === 9)
    r4.__$f |= 2;
  n3(r4, i4, t4);
});
k.prototype.shouldComponentUpdate = function(n3, r4) {
  var i4 = this.__$u;
  if (!(i4 && i4.s !== undefined || 4 & this.__$f))
    return true;
  if (3 & this.__$f)
    return true;
  for (var t4 in r4)
    return true;
  for (var f4 in n3)
    if (f4 !== "__source" && n3[f4] !== this.props[f4])
      return true;
  for (var o4 in this.props)
    if (!(o4 in n3))
      return true;
  return false;
};
function useSignal(n3) {
  return T2(function() {
    return d3(n3);
  }, []);
}
function useComputed(n3) {
  var r4 = A2(n3);
  r4.current = n3;
  v4.__$f |= 4;
  return T2(function() {
    return w3(function() {
      return r4.current();
    });
  }, []);
}
function useSignalEffect(n3) {
  var r4 = A2(n3);
  r4.current = n3;
  y2(function() {
    return E(function() {
      return r4.current();
    });
  }, []);
}
// node_modules/htm/dist/htm.module.js
var n3 = function(t4, s5, r4, e4) {
  var u4;
  s5[0] = 0;
  for (var h3 = 1;h3 < s5.length; h3++) {
    var p4 = s5[h3++], a4 = s5[h3] ? (s5[0] |= p4 ? 1 : 2, r4[s5[h3++]]) : s5[++h3];
    p4 === 3 ? e4[0] = a4 : p4 === 4 ? e4[1] = Object.assign(e4[1] || {}, a4) : p4 === 5 ? (e4[1] = e4[1] || {})[s5[++h3]] = a4 : p4 === 6 ? e4[1][s5[++h3]] += a4 + "" : p4 ? (u4 = t4.apply(a4, n3(t4, a4, r4, ["", null])), e4.push(u4), a4[0] ? s5[0] |= 2 : (s5[h3 - 2] = 0, s5[h3] = u4)) : e4.push(a4);
  }
  return e4;
};
var t4 = new Map;
function htm_module_default(s5) {
  var r4 = t4.get(this);
  return r4 || (r4 = new Map, t4.set(this, r4)), (r4 = n3(this, r4.get(s5) || (r4.set(s5, r4 = function(n4) {
    for (var t5, s6, r5 = 1, e4 = "", u4 = "", h3 = [0], p4 = function(n5) {
      r5 === 1 && (n5 || (e4 = e4.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? h3.push(0, n5, e4) : r5 === 3 && (n5 || e4) ? (h3.push(3, n5, e4), r5 = 2) : r5 === 2 && e4 === "..." && n5 ? h3.push(4, n5, 0) : r5 === 2 && e4 && !n5 ? h3.push(5, 0, true, e4) : r5 >= 5 && ((e4 || !n5 && r5 === 5) && (h3.push(r5, 0, e4, s6), r5 = 6), n5 && (h3.push(r5, n5, 0, s6), r5 = 6)), e4 = "";
    }, a4 = 0;a4 < n4.length; a4++) {
      a4 && (r5 === 1 && p4(), p4(a4));
      for (var l5 = 0;l5 < n4[a4].length; l5++)
        t5 = n4[a4][l5], r5 === 1 ? t5 === "<" ? (p4(), h3 = [h3], r5 = 3) : e4 += t5 : r5 === 4 ? e4 === "--" && t5 === ">" ? (r5 = 1, e4 = "") : e4 = t5 + e4[0] : u4 ? t5 === u4 ? u4 = "" : e4 += t5 : t5 === '"' || t5 === "'" ? u4 = t5 : t5 === ">" ? (p4(), r5 = 1) : r5 && (t5 === "=" ? (r5 = 5, s6 = e4, e4 = "") : t5 === "/" && (r5 < 5 || n4[a4][l5 + 1] === ">") ? (p4(), r5 === 3 && (h3 = h3[0]), r5 = h3, (h3 = h3[0]).push(2, 0, r5), r5 = 0) : t5 === " " || t5 === "\t" || t5 === "\n" || t5 === "\r" ? (p4(), r5 = 2) : e4 += t5), r5 === 3 && e4 === "!--" && (r5 = 4, h3 = h3[0]);
    }
    return p4(), h3;
  }(s5)), r4), arguments, [])).length > 1 ? r4 : r4[0];
}

// node_modules/htm/preact/index.module.js
var m2 = htm_module_default.bind(_);
export {
  useSignalEffect,
  useSignal,
  useComputed,
  n2 as untracked,
  d3 as signal,
  B as render,
  m2 as html,
  _ as h,
  E as effect,
  w3 as computed,
  r3 as batch,
  u3 as Signal,
  k as Component
};
