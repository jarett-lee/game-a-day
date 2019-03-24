using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SimplePlatformController : MonoBehaviour
{
    [HideInInspector] public bool facingRight = true;
    [HideInInspector] public bool jump = false;
    public float moveForce = 365f;
    public float maxSpeed = 5f;
    public float maxJumpHeight = 3;
    // TODO calculate jumpForce based on maxJumpHeight
    public Transform[] groundChecks;

    private bool grounded = false;
    private Rigidbody2D rb2d;

    // Start is called before the first frame update
    void Start()
    {
        rb2d = GetComponent<Rigidbody2D>();
    }

    float JumpForce()
    {
        // 0.5mv^2 = KE = PE = mgh
        // F = ma
        // a = F/m
        // v = at = Ft/m
        // h = 0.5v^2 / g = 0.5(Ft/m)^2 / g
        // m sqrt(2hg) / t = Ft
        return rb2d.mass * Mathf.Sqrt(2 * (maxJumpHeight + 0.04f) * Physics2D.gravity.magnitude) / Time.fixedDeltaTime;
    }

    // Update is called once per frame
    void Update()
    {
        grounded = false;
        foreach (Transform groundCheck in groundChecks)
        {
            RaycastHit2D hit = Physics2D.Raycast(groundCheck.position, Vector2.down, 0.015f, 1 << LayerMask.NameToLayer("Ground"));
            grounded = grounded || hit.collider != null;
        }

        if (Input.GetButtonDown("Jump") && grounded)
        {
            jump = true;
        }
    }

    void FixedUpdate()
    {
        float h = Input.GetAxis("Horizontal");

        if (h * rb2d.velocity.x < maxSpeed)
            rb2d.AddForce(Vector2.right * h * moveForce);

        if (Mathf.Abs(rb2d.velocity.x) > maxSpeed)
            rb2d.velocity = new Vector2(Mathf.Sign(rb2d.velocity.x) * maxSpeed, rb2d.velocity.y);

        if (h > 0 && !facingRight)
            Flip();
        else if (h < 0 && facingRight)
            Flip();

        if (jump)
        {
            rb2d.AddForce(new Vector2(0f, JumpForce()));
            jump = false;
        }
    }

    void Flip()
    {
        facingRight = !facingRight;
        Vector3 theScale = transform.localScale;
        theScale.x *= -1;
        transform.localScale = theScale;
    }
}
