using UnityEngine;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

namespace MOVBattle.UI
{
    public sealed class TouchCameraController : MonoBehaviour
    {
        [SerializeField] private Transform cameraRig;
        [SerializeField, Min(0.01f)] private float panSpeed = 0.005f;
        [SerializeField, Min(0.01f)] private float zoomSpeed = 0.01f;
        [SerializeField, Min(1f)] private float rotationSpeed = 0.3f;
        [SerializeField, Min(2f)] private float minHeight = 8f;
        [SerializeField, Min(5f)] private float maxHeight = 40f;
        [SerializeField] private Vector2 xBounds = new Vector2(-80f, 80f);
        [SerializeField] private Vector2 zBounds = new Vector2(-80f, 80f);

        private float _lastPinchDistance;
        private float _lastTwistAngle;

        private void Awake()
        {
            if (cameraRig == null)
            {
                cameraRig = transform;
            }
        }

        private void Update()
        {
            HandleTouchControls();
            HandleEditorFallbackControls();
            ClampRig();
        }

        private void HandleTouchControls()
        {
            bool handled = false;
#if ENABLE_INPUT_SYSTEM
            handled = HandleTouchControlsInputSystem();
#endif

            if (handled)
            {
                return;
            }

#if ENABLE_LEGACY_INPUT_MANAGER
            if (Input.touchCount == 1)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Moved)
                {
                    PanByScreenDelta(touch.deltaPosition);
                }

                return;
            }

            if (Input.touchCount < 2)
            {
                _lastPinchDistance = 0f;
                _lastTwistAngle = 0f;
                return;
            }

            Touch t0 = Input.GetTouch(0);
            Touch t1 = Input.GetTouch(1);

            float pinchDistance = Vector2.Distance(t0.position, t1.position);
            if (_lastPinchDistance > 0.01f)
            {
                float pinchDelta = pinchDistance - _lastPinchDistance;
                ZoomByDelta(pinchDelta * zoomSpeed);
            }

            _lastPinchDistance = pinchDistance;

            float twistAngle = Vector2.SignedAngle(t0.position - t1.position, (t0.position - t0.deltaPosition) - (t1.position - t1.deltaPosition));
            if (_lastTwistAngle != 0f)
            {
                float delta = twistAngle - _lastTwistAngle;
                RotateByDelta(delta * rotationSpeed);
            }

            _lastTwistAngle = twistAngle;
#else
            _lastPinchDistance = 0f;
            _lastTwistAngle = 0f;
#endif
        }

        private void HandleEditorFallbackControls()
        {
#if ENABLE_INPUT_SYSTEM
            HandleEditorFallbackControlsInputSystem();
#elif ENABLE_LEGACY_INPUT_MANAGER
            if (Input.GetMouseButton(2))
            {
                Vector2 drag = new Vector2(Input.GetAxis("Mouse X"), Input.GetAxis("Mouse Y"));
                PanByScreenDelta(drag * 18f);
            }

            float mouseWheel = Input.mouseScrollDelta.y;
            if (Mathf.Abs(mouseWheel) > Mathf.Epsilon)
            {
                ZoomByDelta(mouseWheel * 1.25f);
            }

            if (Input.GetKey(KeyCode.Q))
            {
                RotateByDelta(-rotationSpeed);
            }
            else if (Input.GetKey(KeyCode.E))
            {
                RotateByDelta(rotationSpeed);
            }
#endif
        }

#if ENABLE_INPUT_SYSTEM
        private bool HandleTouchControlsInputSystem()
        {
            Touchscreen touchScreen = Touchscreen.current;
            if (touchScreen == null)
            {
                _lastPinchDistance = 0f;
                _lastTwistAngle = 0f;
                return false;
            }

            int activeTouches = 0;
            Vector2 firstPosition = default;
            Vector2 firstDelta = default;
            Vector2 secondPosition = default;
            Vector2 secondDelta = default;

            foreach (UnityEngine.InputSystem.Controls.TouchControl touch in touchScreen.touches)
            {
                if (!touch.press.isPressed)
                {
                    continue;
                }

                if (activeTouches == 0)
                {
                    firstPosition = touch.position.ReadValue();
                    firstDelta = touch.delta.ReadValue();
                }
                else if (activeTouches == 1)
                {
                    secondPosition = touch.position.ReadValue();
                    secondDelta = touch.delta.ReadValue();
                }

                activeTouches++;
                if (activeTouches >= 2)
                {
                    break;
                }
            }

            if (activeTouches == 0)
            {
                _lastPinchDistance = 0f;
                _lastTwistAngle = 0f;
                return false;
            }

            if (activeTouches == 1)
            {
                if (firstDelta.sqrMagnitude > 0.0001f)
                {
                    PanByScreenDelta(firstDelta);
                }

                _lastPinchDistance = 0f;
                _lastTwistAngle = 0f;
                return true;
            }

            float pinchDistance = Vector2.Distance(firstPosition, secondPosition);
            if (_lastPinchDistance > 0.01f)
            {
                float pinchDelta = pinchDistance - _lastPinchDistance;
                ZoomByDelta(pinchDelta * zoomSpeed);
            }

            _lastPinchDistance = pinchDistance;

            Vector2 prevFirst = firstPosition - firstDelta;
            Vector2 prevSecond = secondPosition - secondDelta;
            float twistAngle = Vector2.SignedAngle(firstPosition - secondPosition, prevFirst - prevSecond);
            if (_lastTwistAngle != 0f)
            {
                float delta = twistAngle - _lastTwistAngle;
                RotateByDelta(delta * rotationSpeed);
            }

            _lastTwistAngle = twistAngle;
            return true;
        }

        private void HandleEditorFallbackControlsInputSystem()
        {
            Mouse mouse = Mouse.current;
            if (mouse != null)
            {
                if (mouse.middleButton.isPressed)
                {
                    PanByScreenDelta(mouse.delta.ReadValue() * 0.35f);
                }

                float mouseWheel = mouse.scroll.ReadValue().y;
                if (Mathf.Abs(mouseWheel) > Mathf.Epsilon)
                {
                    ZoomByDelta(mouseWheel * 0.025f);
                }
            }

            Keyboard keyboard = Keyboard.current;
            if (keyboard == null)
            {
                return;
            }

            if (keyboard.qKey.isPressed)
            {
                RotateByDelta(-rotationSpeed);
            }
            else if (keyboard.eKey.isPressed)
            {
                RotateByDelta(rotationSpeed);
            }
        }
#endif

        private void PanByScreenDelta(Vector2 delta)
        {
            Vector3 right = cameraRig.right;
            Vector3 forward = Vector3.Cross(right, Vector3.up).normalized;
            Vector3 movement = (-right * delta.x + -forward * delta.y) * panSpeed * cameraRig.position.y;
            cameraRig.position += movement;
        }

        private void ZoomByDelta(float delta)
        {
            Vector3 pos = cameraRig.position;
            pos.y = Mathf.Clamp(pos.y - delta, minHeight, maxHeight);
            cameraRig.position = pos;
        }

        private void RotateByDelta(float delta)
        {
            cameraRig.Rotate(Vector3.up, delta, Space.World);
        }

        private void ClampRig()
        {
            Vector3 pos = cameraRig.position;
            pos.x = Mathf.Clamp(pos.x, xBounds.x, xBounds.y);
            pos.z = Mathf.Clamp(pos.z, zBounds.x, zBounds.y);
            pos.y = Mathf.Clamp(pos.y, minHeight, maxHeight);
            cameraRig.position = pos;
        }
    }
}
